'use client'
import { jsLoginAction } from '@/actions/jsAuth'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginSchema } from '@/schemas'
// import { t, setLocale } from '@/utils/language';
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import {TriangleAlert} from "lucide-react"

export default function Signin({ params }: { params: { lang: string } }) {
    const t = useTranslations();
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    const [error, setError] = useState<string| undefined>("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "", 
            password: ""
        }
    })
    const [isPending, startTrasition] = useTransition()

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        console.log("CallbackURL: ", callbackUrl);
        setError("")
        startTrasition( async () => {
            const response = await jsLoginAction(values, callbackUrl)
        if(!response){
                return setError("Something wrong!! Please reload page...")
            }
            if (response && response["error"] !== undefined) {
                setError(response.error)
            }
        })
    }
    return (
        
        <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
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
                        color="emerald"
                        size="lg"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? t("signin.buttons.submiting") : t("signin.buttons.submit")}
                    </Button>
                    <div className="mt-4 text-center">
                        <span className="text-black">{t("signin.signup.label")}</span>{' '}
                        <Link
                            href="/signup"
                            className="font-semibold cursor-pointer text-emerald-500 hover:text-emerald-700"
                        >
                            {t("signin.buttons.signup")}
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    )
}

