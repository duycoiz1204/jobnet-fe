'use client'
import React, { SetStateAction, useEffect, useState, useTransition } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BusinessType from '@/types/business';
import { useTranslations } from 'next-intl';
import useDebounce from '@/hooks/useDebounce';
import businessService from '@/services/businessService';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';
import { rcRegisterSchema } from '@/schemas/authSchema';
import registrationService from '@/services/registrationService';
import { useRouter } from '@/navigation';
import { TriangleAlert } from 'lucide-react';
import Modal from '@/components/modal/Modal';
import useModal from '@/hooks/useModal';

type Props = {}
type IntentType = 'registerWithNewBusiness' | 'registerWithSelectedBusiness'

export default function RcSignUpForm({ }: Props) {
    const router = useRouter()
    const [error, setError] = useState<string | undefined>("")
    const t = useTranslations();
    const [isPending, startTrasition] = useTransition()
    const { modal, openModal, closeModal } = useModal()
    const [recruiterSignUp, setRecruiterSignUp] = useState({
        intent: 'registerWithNewBusiness' as IntentType,
        selectedBusiness: undefined as BusinessType | undefined,
    })
    const form = useForm<z.infer<typeof rcRegisterSchema>>({
        resolver: zodResolver(rcRegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
            confirmPassword: "",
            businessName: '',
            businessId: ''
        }
    })

    const handleBusinessCreateClick = () => {
        setRecruiterSignUp({
            intent: 'registerWithNewBusiness',
            selectedBusiness: undefined,
        })
    }

    const handleBusinessChange = (business: BusinessType) => {
        setRecruiterSignUp({
            intent: "registerWithSelectedBusiness",
            selectedBusiness: business,
        })
    }


    const onSubmit = (values: z.infer<typeof rcRegisterSchema>) => {
        setError("")
        startTrasition(async () => {
            setError("")
            const validatedField = rcRegisterSchema.safeParse(values)
            console.log("VALues 1: ", values);
            console.log("intent: ", recruiterSignUp.intent);
            if (recruiterSignUp.intent === "registerWithNewBusiness") {
                if (!validatedField.success || !values.businessName) {
                    setError("Invalid Information.")
                } else {
                    const user = await registrationService.registerRecruiterWithNewBusiness(
                        {
                            email: values.email,
                            password: values.password,
                            name: values.name,
                            phone: values.phone,
                            businessName: values.businessName!!
                        }
                    )
                    router.push(`/account/verify?userId=${user.id}&email=${user.email}&baseUrl=/recruiter`)
                }
            } else {
                if (!validatedField.success) {
                    setError("Invalid Information.")
                } else {
                    const user =
                        await registrationService.registerRecruiterWithSelectedBusiness(
                            {
                                email: values.email,
                                password: values.password,
                                name: values.name,
                                phone: values.phone,
                                businessId: recruiterSignUp.selectedBusiness!!.id
                            }
                        )
                    router.push(`/account/verify?userId=${user.id}&email=${user.email}&baseUrl=/recruiter`)
                }
            }

        })
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-col lg:gap-x-4 lg:flex-row lg:gap-y-0 gap-y-4">
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='basis-1/2'>
                                        <FormLabel>{`${t('signup.inputs.name.label')} :`}</FormLabel>
                                        <FormControl>
                                            <Input
                                                className=""
                                                {...field}
                                                disabled={isPending}
                                                placeholder={t('signup.inputs.name.placeholder')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem className='basis-1/2'>
                                        <FormLabel>{`${t('signup.inputs.phone.label')} :`}</FormLabel>
                                        <FormControl>
                                            <Input
                                                className=''
                                                {...field}
                                                disabled={isPending}
                                                placeholder={t('signup.inputs.phone.placeholder')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                        <div className="space-y-2">
                            <FormField control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{`${t('signup.inputs.email.label')} :`}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='email'
                                                disabled={isPending}
                                                placeholder={t('signup.inputs.email.placeholder')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                        <div className="flex flex-col lg:gap-x-4 lg:flex-row lg:gap-y-0 gap-y-4">
                            <FormField control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem className='basis-1/2'>
                                        <FormLabel>{`${t("signup.inputs.password.label")} :`}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type='password'
                                                placeholder={t("signup.inputs.password.placeholder")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem className='basis-1/2'>
                                        <FormLabel>{`${t("signup.inputs.repassword.label")} :`}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type='password'
                                                placeholder={t("signup.inputs.repassword.placeholder")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold text-emerald-500">
                            {t('signup.business.session')}
                        </h2>
                        {recruiterSignUp.selectedBusiness ? (
                            <Button size={'sm'} variant={"emerald"}  onClick={handleBusinessCreateClick}>
                                {t('signup.buttons.createBusiness')}
                            </Button>
                        ) : (
                            <Button
                                size={'sm'}
                                variant={"emerald"}
                                onClick={() => openModal('business-search-modal')}
                            >
                                {t('signup.buttons.selectBusiness')}
                            </Button>
                        )}
                    </div>

                    {!recruiterSignUp.selectedBusiness && (
                        <div className="space-y-4">
                            <FormField control={form.control}
                                name='businessName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{`${t('signup.inputs.businessName.label')} : (*)`}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder={t('signup.inputs.businessName.placeholder')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                    )}
                    {recruiterSignUp.selectedBusiness && (
                        <div>
                            <input
                                type="hidden"
                                name="businessId"
                                value={recruiterSignUp.selectedBusiness.id}
                            />
                            <Link href={`/businesses/${recruiterSignUp.selectedBusiness.id}`}>
                                <BusinessSearchItem business={recruiterSignUp.selectedBusiness} />
                            </Link>
                        </div>
                    )}
                    {
                        error && (
                            <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive text-sm'>
                                <TriangleAlert className='h-4 w-4' />
                                <p>{error}</p>
                            </div>
                        )
                    }
                    <Button
                        type="submit"
                        name="intent"
                        value={recruiterSignUp.intent}
                        className="w-full translate-y-4"
                        variant={"emerald"}
                        size="lg"
                    >
                        {t('signup.buttons.submit')}
                    </Button>

                    <div className="flex justify-center">
                        <span className="text-sm text-black">{t('signup.signin')}</span>
                        <Link
                            href="/recruiter/signin"
                            className="ml-2 text-sm font-semibold cursor-pointer text-emerald-500 hover:underline"
                        >
                            {t('signup.buttons.signin')}
                        </Link>
                    </div>
                </form>
            </Form>
            <Modal
                id="business-search-modal"
                show={modal === 'business-search-modal'}
                onClose={closeModal}
                size="2xl"
            >
                <Modal.Header>{t('signup.business.modalHeader')}</Modal.Header>
                <Modal.Body>
                    <BusinessSearch
                        key={recruiterSignUp.selectedBusiness?.id}
                        closeModal={closeModal}
                        selectedBusiness={recruiterSignUp.selectedBusiness}
                        onBusinessChange={handleBusinessChange}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}

function BusinessSearch({
    closeModal,
    selectedBusiness,
    onBusinessChange,
}: {
    closeModal: () => void,
    selectedBusiness?: BusinessType
    onBusinessChange: (business: BusinessType) => void
}): React.ReactElement {
    const [businessSearch, setBusinessSearch] = useState({
        search: '',
        results: [] as BusinessType[],
        selectedBusiness: selectedBusiness,
        isFocus: false,
    })
    const t = useTranslations()

    const debounce = useDebounce(businessSearch.search, 500)

    useEffect(() => {
        void (async () => {
            console.log("Get: ", debounce);

            const pagination = await businessService.getBusinesses({
                name: debounce,
            })
            console.log("Get RE: ", pagination);
            setBusinessSearch((prev) => ({
                ...prev,
                results: pagination.data,
            }))
        })()
    }, [debounce])

    useEffect(() => {
        selectedBusiness !== undefined &&
            setBusinessSearch((prev) => ({
                ...prev,
                selectedBusiness,
            }))
    }, [selectedBusiness, businessSearch.selectedBusiness])

    useEffect(() => {
        const disableFocus = (e: MouseEvent) => {
            !(e.target as HTMLElement).closest('[id=business]') &&
                setBusinessSearch((prev) => ({
                    ...prev,
                    isFocus: false,
                }))
        }
        window.addEventListener('click', disableFocus)
        return () => window.removeEventListener('click', disableFocus)
    }, [])

    const handleItemClick = (business: BusinessType) => {
        setBusinessSearch((prev) => ({
            ...prev,
            selectedBusiness: business,
            results: [],
            isFocus: false,
        }))
    }



    const handleConfirmClick = () => {
        console.log("Confirm: ", businessSearch?.selectedBusiness);

        businessSearch?.selectedBusiness &&
            onBusinessChange(businessSearch.selectedBusiness)

        closeModal()
    }

    const businessSearchElms = businessSearch.results.map((business) => (
        <BusinessSearchItem
            key={business.id}
            business={business}
            onClick={() => handleItemClick(business)}
            className={clsx({
                'bg-slate-200': selectedBusiness?.id === business.id,
            })}
        />
    ))

    return (
        <div className="space-y-6">
            <div id="business" className="space-y-6">
                <Label htmlFor="businessName">{`${t('signup.inputs.businessName.label')} :`}</Label>
                <Input
                    type="text"
                    id="businessName"
                    placeholder={t('signup.inputs.businessName.placeholder')}
                    autoComplete="false"
                    value={businessSearch.search}
                    onChange={(e) =>
                        setBusinessSearch((prev) => ({
                            ...prev,
                            search: e.target.value,
                        }))
                    }
                    onFocus={() =>
                        setBusinessSearch((prev) => ({ ...prev, isFocus: true }))
                    }
                />
                {businessSearch.results.length >= 0 && businessSearch.isFocus && (
                    <div>
                        <p className="p-2 pt-0 text-sm font-semibold">
                            {t('signup.businessSearch.title') + ' :'}
                        </p>
                        <div className="shadow-md max-h-[265px] overflow-y-scroll divide-y-2">
                            {businessSearch.results.length ? (
                                businessSearchElms
                            ) : (
                                <p className="p-2 text-sm font-semibold text-center">
                                    {t('signup.businessSearch.result')}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {businessSearch.selectedBusiness && (
                <div className="mt-4 space-y-4">
                    <h2 className="text-sm font-semibold text-emerald-500">
                        {`${t('signup.businessSearch.selected')} :`}
                    </h2>
                    <BusinessSearchItem business={businessSearch.selectedBusiness} />
                </div>
            )}
            <div className="flex justify-end gap-4">
                <Button variant={"emerald"} type='submit' onClick={handleConfirmClick}>
                    {t('signup.buttons.confirm')}
                </Button>
                <Button variant={"red"} onClick={closeModal}>
                    {t('signup.buttons.Cancel')}
                </Button>
            </div>
        </div>
    )
}

function BusinessSearchItem({
    business,
    onClick,
    className,
}: {
    business: BusinessType
    onClick?: () => void
    className?: string
}): React.ReactElement {
    return (
        <div
            onClick={onClick}
            className={`${className} p-4 cursor-pointer transition-all rounded hover:bg-slate-100 border-slate-200`}
        >
            <div className="flex items-center gap-x-4">
                <img
                    className="object-cover rounded w-14 h-14"
                    src={
                        business.profileImageId
                            ? businessService.getBusinessProfileImage(business.id)
                            : "/business.png"
                    }
                />
                <div className="flex flex-col">
                    <p className="font-semibold truncate w-96 text-md">{business.name}</p>
                    <div className="flex items-center text-sm gap-x-4">
                        <span>{business.type}</span>
                        <Link
                            href={business.website || ""}
                            onClick={(e) => e.stopPropagation()}
                            className="overflow-hidden hover:underline hover:text-emerald-500"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            Website: {business.website}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
