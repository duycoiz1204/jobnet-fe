import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import { locales } from '@/navigation';
// Can be imported from a shared config
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  console.log("Refresh load");
  
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});