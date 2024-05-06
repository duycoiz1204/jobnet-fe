'use server'
import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';


export const jsLoginAction = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
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