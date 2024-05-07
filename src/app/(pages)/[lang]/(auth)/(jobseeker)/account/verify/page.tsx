'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { jsVerifySchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import envConfig from '@/config'
import registrationService from '@/services/registrationService'
import { useRouter } from '@/navigation'

type Props = {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function page({ searchParams }: Props) {
    const router = useRouter()
    const userId = searchParams.userId
    const email = searchParams.email
    const t = useTranslations()
    const [value, setValue] = useState("")
    const [isPending, startTrasition] = useTransition()
    console.log("UserId: ", userId, email);

    const form = useForm<z.infer<typeof jsVerifySchema>>({
        resolver: zodResolver(jsVerifySchema),
        defaultValues: {
            otpToken: ""
        }
    })

    const onSubmit = (data: z.infer<typeof jsVerifySchema>) => {
        startTrasition(async () => {
            const validatedField = jsVerifySchema.safeParse(data)
            if (validatedField.success) {
                // await registrationService.verifyUser({ userId, otpToken: data.otpToken })
                router.push(`/signin?type=success&message=Account verified successfull.`)
            }
        })
    }

        return (
            <div>
                <h2>
                    {t("verify.sentTitle")} <br />{' '}
                    <span className="font-semibold text-slate-600">{email}</span>
                </h2>
                <Form {...form}>
                    <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col  gap-y-4">
                            <FormField control={form.control}
                                name='otpToken'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{`${t('verify.input.label')} `}</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6}
                                                {...field}
                                                className='w-full'
                                                value={value}
                                                onChange={(value) => setValue(value)}

                                            >
                                                <div className=' w-full flex justify-center items-center'>
                                                    <InputOTPGroup className='w-1/5'>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup className='w-1/5'>
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup className='w-1/5'>
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </div>

                                            </InputOTP>

                                        </FormControl>
                                        <div className="text-center text-sm">
                                            {value === "" ? (
                                                <>Enter your one-time password.</>
                                            ) : (
                                                <>You entered: {value}</>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <Button className="mt-2" type="submit" color="emerald" size="lg">
                                {t("verify.button")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        )
    }