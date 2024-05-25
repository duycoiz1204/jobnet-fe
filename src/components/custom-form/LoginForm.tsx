'use client'
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TriangleAlert } from "lucide-react"
import { LoginAction } from '@/actions/jsAuth'
import { LoginSchema } from '@/schemas/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import {  useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from '@/navigation'
import { DEFAULT_LOGIN_JOBSEEKER_REDIRECT, DEFAULT_LOGIN_RECRUITER_REDIRECT } from '@/routes'

type LoginProps = {

}

export default function LoginForm({ }: LoginProps) {
    const t = useTranslations()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    const [error, setError] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const pathname = usePathname()
    const [isPending, startTrasition] = useTransition()

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        startTrasition(async () => {
            const response = await LoginAction(values, callbackUrl)
            if (!response) {
                return setError("Something wrong!! Please reload page...")
            }
            if (response && response["error"] !== undefined) {
                setError(response.error)
            }else{
                let url = callbackUrl
                if (!url){
                    url = (pathname.includes("recruiter")) ? DEFAULT_LOGIN_RECRUITER_REDIRECT : DEFAULT_LOGIN_JOBSEEKER_REDIRECT
                }
                window.location.href = url
                // console.log("Session Data: ", status);
            }
        })
    }
    return (
        <Form {...form}>
            <form className='space-y-6 h-full' onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 pt-8">
                    <FormField control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{`${t("signin.inputs.email.label")} :`}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder={t("signin.inputs.email.placeholder")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{`${t("signin.inputs.password.label")} :`}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        type='password'
                                        placeholder={t("signin.inputs.password.placeholder")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    {
                        error && (
                            <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive text-sm'>
                                <TriangleAlert className='h-4 w-4' />
                                <p>{error}</p>
                            </div>
                        )
                    }
                    <Button
                        className="mt-4"
                        variant={"emerald"}
                        size="lg"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? t("signin.buttons.submiting") : t("signin.buttons.submit")}
                    </Button>

                </div>
            </form>
        </Form>
    )
}