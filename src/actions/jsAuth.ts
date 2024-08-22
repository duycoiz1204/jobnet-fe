'use server'
import registrationService from '@/services/registrationService';
import * as z from "zod"
import { LoginSchema, jsRegisterSchema, jsVerifySchema } from "@/schemas/authSchema"
import { signIn, signOut } from "@/auth"
import { AuthError } from 'next-auth';


export const LoginAction = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validatedField = LoginSchema.safeParse(values)
    if (!validatedField.success) {
        return { error: "Invalid Credentials." }
    }
    const { email, password, role } = validatedField.data

    try {        
        const urlRedirect = await signIn("credentials", {
            email, password, role, redirect: false
        })
        return { success: "Login successfully", url: urlRedirect }

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

export const jsRegisterAction = async (values: z.infer<typeof jsRegisterSchema>) => {
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

export const logoutAction = async () => {
    await signOut({ redirect: false })
}

