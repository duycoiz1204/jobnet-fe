import { DEFAULT_LOGIN_ADMIN_REDIRECT, DEFAULT_LOGIN_RECRUITER_REDIRECT, adminRoutes, recruiterRoutes } from './routes';
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
    authRoutes,
    DEFAULT_LOGIN_JOBSEEKER_REDIRECT,
    jobSeekerRoutes
} from "@/routes"

function getPosition(str: string, target: string, index: number) {
    return str.split(target, index).join(target).length;
}
function handleHeaders(req: any) {
    const response = i18nMiddleware(req)
    let pathname = (req.nextUrl.pathname as string)

    if (pathname.charAt(0) == '/') pathname = pathname.substring(1)

    if (!response.headers.get("x-url")) {
        response.headers.set('x-url', req.url);
        response.headers.set('x-pathname', pathname.substring(pathname.indexOf("/")));
    }
    return response
}

function checkPrivateRoute(pathname: string){
    
    if (checkRouteIsIncludes(jobSeekerRoutes, pathname)) {
        return {isPrivate: true, role: "JobSeeker" }

    }else if (checkRouteIsIncludes(recruiterRoutes, pathname)) {
        return {isPrivate: true, role: "Recruiter" }

    }else if (checkRouteIsIncludes(adminRoutes, pathname)){
        return {isPrivate: true, role: "Admin" }

    }
    return {isPrivate: false, role: undefined}
}

function checkRouteIsIncludes(list: string[], route: string){

    let isIncluded = false
    list.forEach((value) => {
        if (value == route) return true
        else if (value.includes("**")){
            const pathBeforeLastSlash = value.substring(0, value.lastIndexOf("/"))
            
            if (route.startsWith(pathBeforeLastSlash)) {
                isIncluded = true   
                return
            }
        }
    })
    return isIncluded
}

export default auth((req) => {
    const { pathname } = req.nextUrl

    // First check locale already exist on Url or not
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
    if (!pathnameHasLocale) {
        return handleHeaders(req)
    }

    // console.log("come to auth middleware", pathname);
    const secondSlashIdx = getPosition(pathname, "/", 2)
    const locale = pathname.substring(1, secondSlashIdx)
    let urlWithLocaleRemoved = pathname.substring(
        secondSlashIdx
    )
    if (!urlWithLocaleRemoved) {
        urlWithLocaleRemoved = "/"
    }

    const isLoggedIn = !!req.auth

    const isApiAuthRoute = urlWithLocaleRemoved.startsWith(apiAuthPrefix)

    const isAuthRoute = authRoutes.includes(urlWithLocaleRemoved)
    if (isApiAuthRoute) {
        return handleHeaders(req)
    }

    if (isAuthRoute) {

        if (isLoggedIn) {
            return Response.redirect(new URL( 
                (req.auth!!.user.role == "JobSeeker") ? DEFAULT_LOGIN_JOBSEEKER_REDIRECT : (
                    (req.auth!!.user.role == "Recruiter") ? DEFAULT_LOGIN_RECRUITER_REDIRECT : DEFAULT_LOGIN_ADMIN_REDIRECT
                )
                , req.nextUrl
            )) // Need 2 param to create absolute URL
        }
        return handleHeaders(req)
    }

    const {isPrivate: isPrivateRoute, role: roleReq} = checkPrivateRoute(urlWithLocaleRemoved)
    
    // Check If use not loggedIn yet and try to access Private route
    if (!isLoggedIn && isPrivateRoute) {
        // Need to redirect to previous page after login
        let callBackUrl = req.nextUrl.pathname
        if (req.nextUrl.search) {
            callBackUrl += req.nextUrl.search
        }

        const encodedCallbackUrl = encodeURIComponent(callBackUrl)
        // Bring CallbackUrl to LoginForm 
        let url = `/${locale}/`
        if (roleReq == "Recruiter"){
            url += "recruiter"
        }else if (roleReq == "Admin"){
            url += "admin"
        }
        return Response.redirect(new URL(
            `${url}/signin?callbackUrl=${encodedCallbackUrl}`,
            req.nextUrl
        ))
    }

    // Hanle authorization
    if (isPrivateRoute && isLoggedIn) {
        if ( req.auth!!.user.role != roleReq ) {
            // AccessDenied
            return Response.redirect(new URL(
                `/${locale}/accessDenied`,
                req.nextUrl
            ))
        }
    }

    return handleHeaders(req)
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
