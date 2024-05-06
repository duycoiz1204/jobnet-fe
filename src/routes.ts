/**
 * An array of routes that are accessible to public
 * These route not required authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/", 
]

/**
 * An array of routes that are used for authentication
 * These route will redirect user to /settings
 * @type {string[]}
 */
export const authRoutes = [
    "/signin",
    "/signup"
]

/**
 * The prefix for API authentication routes
 * Routes start with this prefix are used for API
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect URL after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/profile"