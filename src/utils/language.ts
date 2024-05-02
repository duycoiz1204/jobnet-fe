import { i18n } from '@/middlewares/i18n';

type Dictionary = {
  [key: string]: any;
};

// Define the dictionaries object with explicit types
const language = {
  dictionaries: {
    en: await import('@/languages/en.json').then((module) => module.default),
    vi: await import('@/languages/vi.json').then((module) => module.default),
  } as Dictionary,
  locale: i18n.defaultLocale,
};

const getObjectValue = (obj: any, key: string) => {
  return key
    .split('.')
    .reduce((acc, currKey) => (acc ? acc[currKey] : undefined), obj);
};

export const t = (
  key: string,
  options?: { [key: string]: string | number }
) => {
  const dictionary = language.dictionaries[language.locale];
  let value = getObjectValue(dictionary, key);

  // Replace placeholders in value with provided options
  let replacedValue = value;
  options &&
    Object.keys(options).forEach((key) => {
      replacedValue = replacedValue?.replace(
        new RegExp(`{{\\s*${key}\\s*}}`, 'g'),
        options[key]
      );
    });

  return replacedValue;
};

export const setLocale = (locale: string) => {
  language.locale = locale;
};
