import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const AppConfig = {
  name: 'Elpix Ai Developers',
  locales: ['en', 'fr'],
  defaultLocale: 'en',
};

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get('locale')?.value || 'en';
  const locale = cookieLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
