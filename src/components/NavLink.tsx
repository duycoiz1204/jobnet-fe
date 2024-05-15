'use client'
import { Link, usePathname } from '@/navigation'
import { headers } from 'next/headers'

interface NavLinkProps {
    href: string,
    children: React.ReactNode,
    className:  (({isActive}: {isActive: boolean}) => string) | string 
}

export const NavLink = ({ href, children, className }: NavLinkProps) => {
    const pathname = usePathname() as string
    let className1 = ''
    const isActive = (pathname === href) ? true : pathname.startsWith(href)
    
    if (typeof className === "string"){
        className1 = className
    }else{
        className1 += className({ isActive })
    }

    return (
        <Link href={href} className={className1}>
            {children}
        </Link>
    )
}