import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { getById, updated } from '@/services/api';
import Form from '@/components/form/Form';
import { toast } from 'react-toastify';
import { EditFormValues, Access } from '../_interfaces/Access';
import { EditModalsProps } from '@/types/common';
import Switch from '@/components/form/switch/Switch';
import LoadingForm from './LoadingForm';
import { useTranslations } from 'next-intl';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().nullable(),
  isActive: yup.boolean().required('Is Active is required'),
});

const EditForm: React.FC<EditModalsProps<Access>> = ({
  title,
  initValues,
  isOpen,
  onClose,
  refresh,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadIcon, setIsLoadIcon] = useState<boolean>(false);

  const t = useTranslations('index');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen && initValues) {
      setIsLoading(true);
      getById('/api/v1/access', initValues.id)
        .then((res) => {
          if (res?.data) {
            reset({
              name: res.data.name || '',
              description: res.data.description || '',
              isActive: res.data.isActive || true,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, reset, initValues]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<EditFormValues> = async (data) => {
    console.log('ssss: ', data);
    setIsLoadIcon(true);
    const payload = {
      ...data,
      description: data.description || '',
    };

    try {
      const response = await updated('/api/v1/access', initValues.id, payload);
      toast.success(`${response.message}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
      refresh();
      onClose();
    } catch (error) {
      console.error('Error update access:', error);
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
          <>
            <LoadingForm />
          </>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-7">
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
                placeholder="Enter your name"
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
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('label.description')}
              </Label>
              <TextArea
                id="description"
                placeholder="Enter your description here..."
                rows={4}
                error={!!errors.description}
                hint={errors.description ? errors.description.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('description')}
              />
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm dark:border-gray-800 dark:bg-white/5">
              <div className="flex justify-between items-center">
                <Label htmlFor="isRoot" className="mb-0 cursor-pointer">
                  {t('label.isActive')}
                </Label>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      defaultChecked={field.value}
                      onChange={(checked) => field.onChange(checked)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={handleClose}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
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
                    Loading...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default EditForm;
