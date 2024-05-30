import { FaLock, FaUser } from 'react-icons/fa6'
import { IconType } from 'react-icons'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminSignIn(): JSX.Element {
    const t = useTranslations()

    return (
        // <Form method="post" replace>
        //     <div className="flex flex-col gap-4 pt-8">
        //         <Label htmlFor='email'>{`${t("signin.inputs.email.label")} :`}</Label>
        //         <Input
        //             placeholder={t("signin.inputs.email.placeholder")}
        //             icon={FaUser as IconType}
        //             type="text"
        //             color="emerald"
        //             iconConfig="text-emerald-600"
        //             id="email"
        //             name="email"
        //         />
        //         <Label htmlFor='password'>{`${t("signin.inputs.password.label")} :`}</Label>
        //         <Input
        //             placeholder={t("signin.inputs.password.placeholder")}
        //             icon={FaLock as IconType}
        //             type="password"
        //             color="emerald"
        //             iconConfig="text-emerald-600"
        //             id="password"
        //             name="password"
        //         />
        //         <Button
        //             className="mt-4"
        //             color="emerald"
        //             size="lg"
        //             type="submit"
        //             disabled={navigation.state === 'submitting'}
        //         >
        //             {navigation.state === 'submitting' ? t("signin.buttons.submiting") : t("signin.buttons.submit")}
        //         </Button>
        //     </div>
        // </Form>
        <div></div>
    )
}
