import {createSharedPathnamesNavigation} from 'next-intl/navigation';
 
export const locales = ['en', 'vi'] as const;
export const defaultLocale = 'en'
export const localePrefix = 'always'; // Default
 
/**
 * Some function to change locale.
 * Client component: useRouter, usePathname, Link
 * Server component: redirect, Link
 */
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, localePrefix});
