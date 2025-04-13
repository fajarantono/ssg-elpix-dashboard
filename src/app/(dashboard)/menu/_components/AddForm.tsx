import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { AddFormValues } from '../_interfaces/Menu';
import { AddModalsProps } from '@/types/common';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Form from '@/components/form/Form';
import { created, getAllData } from '@/services/api';
import { useTranslations } from 'next-intl';
import LoadingForm from './LoadingForm';
import SelectTree, { OptionSelectTree } from '@/components/form/SelectTree';
import { useMenu } from '@/context/MenuContext';

const AddForm: React.FC<AddModalsProps> = ({
  title,
  isOpen,
  onClose,
  refresh,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadIcon, setIsLoadIcon] = useState<boolean>(false);
  const [parent, setParent] = useState<OptionSelectTree[]>([]);
  const { refreshMenu } = useMenu();

  const t = useTranslations('index');

  const schema = yup.object().shape({
    name: yup.string().required(t('validate.fieldRequired')),
    alias: yup.string().required(t('validate.fieldRequired')),
    sequenceNo: yup.number().required(t('validate.fieldRequired')),
    icon: yup.string().required(t('validate.fieldRequired')),
    url: yup.string().required(t('validate.fieldRequired')),
    parentId: yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      alias: '',
      sequenceNo: 1,
      icon: '',
      url: '',
      parentId: '',
    },
  });

  const fetchParent = async () => {
    try {
      const response = await getAllData('/api/v1/menu/access');
      if (Array.isArray(response.data)) {
        setParent(response.data);
      } else {
        setParent([]);
      }
    } catch (error) {
      toast.error(`Failed to fetch parent: ${error}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      reset();
      fetchParent().finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<AddFormValues> = async (data) => {
    setIsLoadIcon(true);
    const payload = {
      ...data,
      parentId: data.parentId ?? '',
      isActive: true,
    };
    
    try {
      const response = await created('/api/v1/menu', payload);
      toast.success(`${response.message}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
      refresh();
      onClose();
      refreshMenu();
    } catch (error) {
      toast.error(`${error}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    } finally {
      setIsLoadIcon(false);
    }
  };

  return (
    <Modal
      className="top-0 mt-4 max-w-[584px]"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white/90">
          {title}
        </h2>
        {isLoading ? (
          <LoadingForm />
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-7">
            <div>
              <Label
                htmlFor="sequenceNo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                {t('label.sequenceNo')}
              </Label>
              <Input
                id="sequenceNo"
                placeholder={t('placeholder.sequenceNo')}
                error={!!errors.name}
                hint={errors.sequenceNo ? errors.sequenceNo.message : ''}
                className={`mt-1 block ${
                  errors.sequenceNo ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('sequenceNo')}
              />
            </div>
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                {t('label.name')}
              </Label>
              <Input
                id="name"
                placeholder={t('placeholder.name')}
                error={!!errors.name}
                hint={errors.name ? errors.name.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('name')}
              />
            </div>
            <div>
              <Label
                htmlFor="alias"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                {t('label.alias')}
              </Label>
              <Input
                id="alias"
                placeholder={t('placeholder.alias')}
                error={!!errors.alias}
                hint={errors.alias ? errors.alias.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.alias ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('alias')}
              />
            </div>
            <div>
              <Label
                htmlFor="parentId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={false}
              >
                {t('label.parent')}
              </Label>
              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <SelectTree
                    id="parentId"
                    options={parent.map((parent) => ({
                      id: parent.id,
                      name: parent.name,
                      children: parent.children || [],
                    }))}
                    placeholder="Select a parent"
                    value={field.value || ''}
                    onChange={(selected) => field.onChange(selected)}
                    error={!!errors?.parentId}
                    hint={errors?.parentId?.message ?? ''}
                  />
                )}
              />
            </div>
            <div>
              <Label
                htmlFor="icon"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                {t('label.icon')}
              </Label>
              <Input
                id="icon"
                placeholder={t('placeholder.icon')}
                error={!!errors.name}
                hint={errors.icon ? errors.icon.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.icon ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('icon')}
              />
            </div>

            <div>
              <Label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                {t('label.url')}
              </Label>
              <Input
                id="url"
                placeholder={t('placeholder.url')}
                error={!!errors.name}
                hint={errors.url ? errors.url.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.url ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('url')}
              />
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={handleClose}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                {t('label.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoadIcon}
              >
                {isLoadIcon ? (
                  <>
                    <span className="animate-spin">
                      <svg
                        className="inline-block mr-2"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          opacity="0.5"
                          cx="10"
                          cy="10"
                          r="8.75"
                          stroke="white"
                          strokeWidth="2.5"
                        ></circle>
                        <mask id="path-2-inside-1_3755_26472" fill="white">
                          <path d="M18.2372 12.9506C18.8873 13.1835 19.6113 12.846 19.7613 12.1719C20.0138 11.0369 20.0672 9.86319 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.7019 0.637155 12.5858 0.270357 11.435 0.103491C10.7516 0.00440265 10.179 0.561473 10.1659 1.25187V1.25187C10.1528 1.94226 10.7059 2.50202 11.3845 2.6295C12.1384 2.77112 12.8686 3.02803 13.5487 3.39333C14.5973 3.95661 15.4968 4.76141 16.1728 5.74121C16.8488 6.721 17.2819 7.84764 17.4361 9.02796C17.5362 9.79345 17.5172 10.5673 17.3819 11.3223C17.2602 12.002 17.5871 12.7178 18.2372 12.9506V12.9506Z"></path>
                        </mask>
                        <path
                          d="M18.2372 12.9506C18.8873 13.1835 19.6113 12.846 19.7613 12.1719C20.0138 11.0369 20.0672 9.86319 19.9156 8.70384C19.7099 7.12996 19.1325 5.62766 18.2311 4.32117C17.3297 3.01467 16.1303 1.94151 14.7319 1.19042C13.7019 0.637155 12.5858 0.270357 11.435 0.103491C10.7516 0.00440265 10.179 0.561473 10.1659 1.25187V1.25187C10.1528 1.94226 10.7059 2.50202 11.3845 2.6295C12.1384 2.77112 12.8686 3.02803 13.5487 3.39333C14.5973 3.95661 15.4968 4.76141 16.1728 5.74121C16.8488 6.721 17.2819 7.84764 17.4361 9.02796C17.5362 9.79345 17.5172 10.5673 17.3819 11.3223C17.2602 12.002 17.5871 12.7178 18.2372 12.9506V12.9506Z"
                          stroke="white"
                          strokeWidth="4"
                          mask="url(#path-2-inside-1_3755_26472)"
                        ></path>
                      </svg>
                    </span>
                    <div>LoFading...</div>
                  </>
                ) : (
                  t('label.save')
                )}
              </button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default AddForm;
