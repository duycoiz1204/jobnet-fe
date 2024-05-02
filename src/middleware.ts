import { NextRequest, NextResponse } from 'next/server';
import i18nMiddleware from '@/middlewares/i18n';

export default function middleware(request: NextRequest) {
  // Handle i18n
  let response = i18nMiddleware(request);
  if (response) return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
