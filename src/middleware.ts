import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, localePrefix } from '@/navigation';
import createMiddleware from 'next-intl/middleware';


const i18nMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix
});

import { auth } from "@/auth"
import {
    apiAuthPrefix,
    publicRoutes,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT
} from "@/routes"

function getPosition(str: string, target: string, index: number) {
    return str.split(target, index).join(target).length;
}
export default auth((req) => {
    const {pathname} = req.nextUrl
    console.log("Come to Auth: ", pathname)

    // First check locale already exist on Url or not
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    if(!pathnameHasLocale){
        return i18nMiddleware(req)
    }

    // console.log("come to auth middleware", pathname);
    const secondSlashIdx = getPosition(pathname, "/", 2)
    const locale = pathname.substring(1, secondSlashIdx)
    let urlAfterDiscardPrefix = pathname.substring(
        secondSlashIdx
    )
    if(!urlAfterDiscardPrefix){
        urlAfterDiscardPrefix = "/"
    }
    console.log("urlAfterDiscardPrefix ", urlAfterDiscardPrefix);
    
    const isLoggedIn = !!req.auth
    console.log("Is loggedIN: ", isLoggedIn);

    const isApiAuthRoute = urlAfterDiscardPrefix.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(urlAfterDiscardPrefix)
    const isAuthRoute = authRoutes.includes(urlAfterDiscardPrefix)
    if (isApiAuthRoute) {
        return i18nMiddleware(req)
    }
    if (isAuthRoute) {
        console.log("isAuthRoute: ", isAuthRoute)

        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl)) // Need 2 param to create absolute URL
        }
        return i18nMiddleware(req)
    }
    if (!isLoggedIn && !isPublicRoute) {
        // Need to redirect to previous page after login
        let callBackUrl = req.nextUrl.pathname
        if (req.nextUrl.search) {
            callBackUrl += req.nextUrl.search
        }
        console.log("callbackURL: ", callBackUrl);
        
        const encodedCallbackUrl = encodeURIComponent(callBackUrl)
        // Bring CallbackUrl to LoginForm 
        
        return Response.redirect(new URL(
            `/${locale}/signin?callbackUrl=${encodedCallbackUrl}`,
            req.nextUrl
        ))
    }
    return i18nMiddleware(req)
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
 