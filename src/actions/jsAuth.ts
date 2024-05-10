'use server'
import registrationService from '@/services/registrationService';
import * as z from "zod"
import { LoginSchema, jsRegisterSchema, jsVerifySchema } from "@/schemas/authSchema"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';


export const LoginAction = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validatedField = LoginSchema.safeParse(values)
    if (!validatedField.success) {
        return { error: "Invalid Credentials." }
    }
    const { email, password } = validatedField.data

    try {
        await signIn("credentials", {
            email, password, redirectTo: callbackUrl ||
                DEFAULT_LOGIN_REDIRECT
        })
        return { success: "Login successfully" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials." }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error
    }
}

export const jsRegisterAction = async (values: z.infer<typeof LoginSchema>) => {
    const validatedField = jsRegisterSchema.safeParse(values)
    if (!validatedField.success) {
        return { error: "Invalid Credentials." }
    }

    return await registrationService.registerJobSeeker(values)
}

export const jsVerifyAction = async (values: z.infer<typeof jsVerifySchema>, userId: string) => {
    const validatedField = jsVerifySchema.safeParse(values).data
    return await registrationService.verifyUser({ userId, otpToken: validatedField!!.otpToken })
}

