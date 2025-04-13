import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { AddFormValues } from '../_interfaces/User';
import { AddModalsProps } from '@/types/common';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Form from '@/components/form/Form';
import FileInput from '@/components/form/input/FileInput';
import { created, getAllData } from '@/services/api';
import { EyeIcon, EyeCloseIcon } from '@/icons';
import Select from '@/components/form/Select';
import LoadingForm from './LoadingForm';
import Image from 'next/image';

const schema = yup.object().shape({
  fullname: yup.string().required('Fullname is required'),
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup.string().required('Phone is required'),
  avatarFile: yup.string().nullable(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number'),
  roleId: yup.string().required('Role is required'),
});

const AddForm: React.FC<AddModalsProps> = ({
  title,
  isOpen,
  onClose,
  refresh,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadIcon, setIsLoadIcon] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: '',
      username: '',
      phone: '',
      email: '',
      password: '',
      avatarFile: '',
      roleId: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      reset();
      setAvatarPreview(null);
      fetchRoles().finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, reset]);

  const fetchRoles = async () => {
    try {
      const response = await getAllData('/api/v1/role');
      if (Array.isArray(response.data)) {
        setRoles(response.data);
      } else {
        setRoles([]);
      }
    } catch (error) {
      toast.error(`Failed to fetch roles: ${error}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setValue('avatarFile', base64String);
      };
    }
  };

  const handleClose = () => {
    reset();
    setAvatarPreview(null);
    onClose();
  };

  const onSubmit: SubmitHandler<AddFormValues> = async (data) => {
    setIsLoadIcon(true);

    const payload = {
      ...data,
      avatarFile: data.avatarFile ?? '',
      isActive: true,
    };

    try {
      const response = await created('/api/v1/user', payload);

      toast.success(response.message, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
      refresh();
      onClose();
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
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                Fullname
              </Label>
              <Input
                id="fullname"
                placeholder="Enter your Fullname"
                error={!!errors.fullname}
                hint={errors.fullname ? errors.fullname.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.fullname ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('fullname')}
              />
            </div>
            <div>
              <Label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your Username"
                error={!!errors.username}
                hint={errors.username ? errors.username.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('username')}
              />
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                Email
              </Label>
              <Input
                id="email"
                placeholder="Enter your Email"
                error={!!errors.email}
                hint={errors.email ? errors.email.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('email')}
              />
            </div>

            <div>
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="Enter your Phone Number"
                error={!!errors.phone}
                hint={errors.phone ? errors.phone.message : ''}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                register={register('phone')}
              />
            </div>

            <div>
              <Label
                htmlFor="avatarFile"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Avatar File (optional)
              </Label>
              <FileInput
                accept="image/*"
                onChange={handleAvatarChange}
                className="custom-class"
              />
              {avatarPreview && (
                <Image
                  src={avatarPreview}
                  alt="Avatar Preview"
                  width={120}
                  height={90}
                  className="w-24 h-24 mt-2 rounded-sm"
                />
              )}
              {errors.avatarFile && (
                <p className="text-red-500">{errors.avatarFile.message}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  error={!!errors.password}
                  hint={errors.password ? errors.password.message : ''}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  register={register('password')}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            <div>
              <Label
                htmlFor="roleId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                required={true}
              >
                Role
              </Label>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <Select
                    id="roleId"
                    options={roles.map((role) => ({
                      value: role.id,
                      label: role.name,
                    }))}
                    placeholder="Select a role"
                    value={field.value ?? ''}
                    onChange={(selected) => field.onChange(selected)}
                    error={!!errors?.roleId}
                    hint={errors?.roleId?.message ?? ''}
                  />
                )}
              />
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
                    <div>Loading...</div>
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

export default AddForm;
