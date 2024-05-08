import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string({
        invalid_type_error: "Must be a string"
    }).email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required."
    })
})

export const jsRegisterSchema = z.object({
    name: z.string({
        invalid_type_error: "Must be a string"
    }),
    email: z.string({
        invalid_type_error: "Must be a string"
    }).email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required."
    })
})

export const jsVerifySchema = z.object({
    otpToken: z.string({
        invalid_type_error: "Must be a string"
    }).min(6, {
        message: "Your one-time password must be 6 characters.."
    })
})

/**
 * This Schema decribe about enviroment variable
 */
export const configSchema = z.object({
    AUTH_SECRET: z.string(),
    VITE_API_BASE_URL: z.string(),
    VITE_API_ELASTIC: z.string()
})


