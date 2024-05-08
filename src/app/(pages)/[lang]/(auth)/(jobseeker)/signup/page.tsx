'use client'
import React, { useState, useTransition } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { jsRegisterSchema } from '@/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import registrationService from '@/services/registrationService';
import { useRouter } from '@/navigation';
import envConfig from '@/config';
import { jsRegisterAction } from '@/actions/jsAuth';
import UserType from '@/types/user';

type Props = {
  
}

export default function page({ }: Props) {
  const t = useTranslations();
  const [error, setError] = useState<string | undefined>("")
  const router = useRouter()
  const form = useForm<z.infer<typeof jsRegisterSchema>>({
    resolver: zodResolver(jsRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  })
  const [isPending, startTrasition] = useTransition()
  const onSubmit = (values: z.infer<typeof jsRegisterSchema>) => {
    setError("")
    startTrasition(async () => {

      const validatedField = jsRegisterSchema.safeParse(values)
      if (!validatedField.success) {
        setError("Invalid Credentials.")
      }else{
        console.log("Values: ", values);
        
        const user = await jsRegisterAction(values) as UserType
        if (user ) router.push(`/account/verify?userId=${user.id}&email=${user.email}`)
      }
    })
  } 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 mt-8">
          <FormField control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${t('signup.inputs.name.label')} :`}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={t('signup.inputs.name.placeholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${t('signup.inputs.email.label')} :`}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={t('signup.inputs.email.placeholder')} />
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
            {t('signup.buttons.submit')}
          </Button>
          <div className="mx-auto mt-2">
            <span className="text-black">{t('signup.signin')}</span>{' '}
            <Link
              href="/signin"
              className="font-semibold cursor-pointer text-emerald-500 hover:text-emerald-700"
            >
              {t("signup.buttons.signin")}
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}