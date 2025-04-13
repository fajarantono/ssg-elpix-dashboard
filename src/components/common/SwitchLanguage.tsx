'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookieLocale, setCookieLocale } from '@/lib/cookies';
import FlagIcon from '@/components/icons/FlagIcon';

const LANGUAGE_SELECTOR_ID = 'language-selector';

const languages = [
  { key: 'en', name: 'EN' },
  { key: 'id', name: 'ID' },
];

export default function SwitchLanguage() {
  const [locale, setLocale] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getCookieLocaleAsync = async () => {
      const cookieLocale = await getCookieLocale();
      if (cookieLocale) {
        setLocale(cookieLocale);
        await setCookieLocale(cookieLocale);
      } else {
        const browserLocale = navigator.language.slice(0, 2);
        setLocale(browserLocale);
        await setCookieLocale(browserLocale);
        router.refresh();
      }
    };
    getCookieLocaleAsync();
  }, [router]);

  const changeLocale = async (newLocale: string) => {
    setLocale(newLocale);
    await setCookieLocale(newLocale);
    router.refresh();
  };

  const handleLanguageChange = (language: { key: string; name: string }) => {
    changeLocale(language.key);
    setIsOpen(false);
  };

  const selectedLanguage =
    languages.find((lang) => lang.key === locale) || languages[0];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="inline-flex items-center shadow-theme-xs relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          id={LANGUAGE_SELECTOR_ID}
          aria-expanded={isOpen}
        >
          <FlagIcon
            countryCode={selectedLanguage.key}
            className="w-5 h-5 me-3"
          />
          {selectedLanguage.name}
          <svg
            className="-me-1 ms-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <div
            className="absolute top-full mt-2 w-40 rounded-md shadow-sm bg-white border border-gray-300 
            dark:bg-gray-800 dark:border-gray-600"
            role="menu"
            aria-labelledby={LANGUAGE_SELECTOR_ID}
          >
            <div className="py-1 flex flex-col" role="none">
              {languages.map((language) => (
                <button
                  key={language.key}
                  onClick={() => handleLanguageChange(language)}
                  className={`${
                    selectedLanguage.key === language.key
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  } flex items-center gap-2 px-4 py-2 text-sm text-start hover:bg-gray-100 dark:hover:bg-gray-700`}
                  role="menuitem"
                >
                  <FlagIcon
                    countryCode={language.key}
                    className="w-5 h-5 me-2"
                  />
                  <span className="truncate">{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
