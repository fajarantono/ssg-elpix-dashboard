import { Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const outfit = Outfit({
  variable: '--font-outfit-sans',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const message = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        <ThemeProvider>
          <ToastContainer />
          <NextTopLoader />
          <NextIntlClientProvider messages={message}>
            <SidebarProvider>{children}</SidebarProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
