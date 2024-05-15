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
function handleHeaders(req: any) {
    const response = i18nMiddleware(req)
    if(!response.headers.get("x-url")){
        response.headers.set('x-url', req.url);
        response.headers.set('x-pathname', req.nextUrl.pathname);
    }
    return response
}
export default auth((req) => {
    const {pathname} = req.nextUrl
    
    // First check locale already exist on Url or not
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    if(!pathnameHasLocale){
        return handleHeaders(req)
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
    
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = urlAfterDiscardPrefix.startsWith(apiAuthPrefix)
    let isPublicRoute = false
    publicRoutes.forEach((value) => {
        if(value == urlAfterDiscardPrefix) {isPublicRoute = true}
        else if (value.includes("**")){
            const pathBeforeLastSlash = value.substring(0, value.lastIndexOf("/"))
            if (urlAfterDiscardPrefix.startsWith(pathBeforeLastSlash)){
                isPublicRoute = true
            }
        } 
    })
    const isAuthRoute = authRoutes.includes(urlAfterDiscardPrefix)
    if (isApiAuthRoute) {
        return handleHeaders(req)
    }
    if (isAuthRoute) {

        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl)) // Need 2 param to create absolute URL
        }
        // need to Hanle role
        return handleHeaders(req)
    }
    
    if (!isLoggedIn && !isPublicRoute) {
        // Need to redirect to previous page after login
        let callBackUrl = req.nextUrl.pathname
        if (req.nextUrl.search) {
            callBackUrl += req.nextUrl.search
        }
        
        const encodedCallbackUrl = encodeURIComponent(callBackUrl)
        // Bring CallbackUrl to LoginForm 
        
        return Response.redirect(new URL(
            `/${locale}/signin?callbackUrl=${encodedCallbackUrl}`,
            req.nextUrl
        ))
    }
    return handleHeaders(req)
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
 