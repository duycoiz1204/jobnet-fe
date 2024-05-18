import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export default function SessionsProvider({ children, refetchInterval, session }: {
    children: React.ReactNode,
    refetchInterval?: number
    session: Session | null
}) {
    return (
        <SessionProvider session={session} refetchInterval={refetchInterval}>
            {children}
        </SessionProvider>
    )
}