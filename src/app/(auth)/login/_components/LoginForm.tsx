'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { login } from '@/services';
import { useTranslations } from 'next-intl';
import SwitchLanguage from '@/components/common/SwitchLanguage';
import { toast } from 'react-toastify';
import Form from '@/components/form/Form';
import Image from 'next/image';

interface FormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState(false);

  const router = useRouter();

  const t = useTranslations('index.authPage');
  const v = useTranslations('index.validate');

  const schema = yup.object().shape({
    username: yup.string().required(v('fieldRequired')),
    password: yup.string().required(v('fieldRequired')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      const response = await login(data.username, data.password);

      toast.success(`${response.message}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });

      setTimeout(() => {
        setRedirecting(true);
      }, 1000);
    } catch (error) {
      toast.error(`${error}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (redirecting) {
      router.push('/dashboard');
    }
  }, [redirecting, router]);

  return (
    <>
      <div className="flex flex-col justify-center lg:flex-1 md:flex-1 w-full max-w-md mx-auto">
        <div className="flex flex-row justify-center sm:pt-10 mb-5">
          <Image
            src="/images/logo/elpix-ai.svg"
            alt="Login Background"
            width={120}
            height={38}
            className="object-cover rounded-r-3xl"
            priority
          />
          <span className="text-2xl mx-2 my-1">for</span>
          <Image
            src="/images/logo/tvri.png"
            alt="Login Background"
            width={74}
            height={38}
            className="object-cover rounded-r-3xl"
            priority
          />
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t('headerTitle')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('subHeaderTitle')}
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <Label>
                  {t('labelUsername')} <span className="text-error-500">*</span>{' '}
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={t('placeholderUsername')}
                  error={!!errors.username}
                  hint={errors.username ? errors.username.message : ''}
                  className={`${errors.username ? 'border-red-500' : ''}`}
                  register={register('username')}
                />
              </div>

              <div>
                <Label>
                  {t('labelPassword')} <span className="text-error-500">*</span>{' '}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('placeholderPassword')}
                    error={!!errors.password}
                    hint={errors.password ? errors.password.message : ''}
                    className={`${
                      errors.password ? 'border-red-500' : ''
                    } flex items-center`}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    {t('labelRememberMe')}
                  </span>
                </div>
                <Link
                  href="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t('labelForgotPassword')}
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">
                        <svg
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
                    'Login'
                  )}
                </button>
              </div>
            </div>
          </Form>

          <p className="text-xs text-gray-400 mt-4 text-center">
            {t('footerNoteLogin')}
          </p>
        </div>
      </div>

      <div className="sm:py-7 sm:flex-1 mt-5 text-end">
        <SwitchLanguage />
      </div>
    </>
  );
}
