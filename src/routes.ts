/**
 * An array of routes that are accessible to public - Removed
 * These route not required authentication
 * @type {string[]}
 */
export const publicRoutes = [
  '/',
  '/posts/**',
  '/businesses/**',
  '/categories',
  '/recruiter',
  '/accessDenied',
  '/test',
];

/**
 * An array of routes that are accessible to jobSeeker route
 * These route required authentication
 * @type {string[]}
 */
export const jobSeekerRoutes = ['/profile/**'];

/**
 * An array of routes that are accessible to recruiter route
 * These route required authentication
 * @type {string[]}
 */
export const recruiterRoutes = [
  "/recruiter/posts/**",
  "/recruiter/profile/**"
];

/**
 * An array of routes that are accessible to admin route
 * These route required authentication
 * @type {string[]}
 */
export const adminRoutes = ['/admin/**'];

/**
 * An array of routes that are used for authentication
 * These route will redirect user to /settings
 * @type {string[]}
 */
export const authRoutes = [
  '/signin',
  '/signup',
  '/account/verify',
  '/recruiter/signin',
  '/recruiter/signup',
];

/**
 * The prefix for API authentication routes
 * Routes start with this prefix are used for API
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect URL after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_JOBSEEKER_REDIRECT = '/';
export const DEFAULT_LOGIN_RECRUITER_REDIRECT = '/recruiter';
