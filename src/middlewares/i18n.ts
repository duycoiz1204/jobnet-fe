import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const i18n = {
  languages: new Negotiator({
    headers: { 'accept-language': 'en' },
  }).languages(),
  locales: ['en', 'vi'],
  defaultLocale: 'en',

  // Get the preferred locale, similar to the above or using a library
  getLocale: () => {
    return match(i18n.languages, i18n.locales, i18n.defaultLocale);
  },
};

export default function i18nMiddleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = i18n.getLocale();
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}
