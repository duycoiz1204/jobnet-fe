import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
  return (
    <>
      <div>Protected Page</div>
      <form action={async () => {
        "use server"
        await signOut()
      }}>
        <button type='submit'>logout</button>
      </form>
    </>
  )
}