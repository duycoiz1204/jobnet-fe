import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string({
        invalid_type_error: "Must be a string"
    }).email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required."
    }),
    role: z.string()
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

export const rcRegisterSchema = z.object({
    name: z.string({
        invalid_type_error: "Must be a string"
    }).min(1, {
        message: "Name is required."
    }),
    email: z.string({
        invalid_type_error: "Must be a string"
    }).email({
        message: "Email is required"
    }),
    phone: z.string({
        invalid_type_error: "Must be a string"
    }).min(10, {
        message: "Phone must at lease 10 digits"
    }),
    password: z.string().min(1, {
        message: "Password is required."
    }),
    confirmPassword: z.string().min(1, {
        message: "Password is required."
    }),
    businessName: z.string().optional(),
    businessId: z.string({
        invalid_type_error: "Must be a string"
    }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

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
    AUTH_SECRET: z.string().optional(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_ELASTIC: z.string(),
    NEXT_PUBLIC_TINYMCE_KEY: z.string()
})


