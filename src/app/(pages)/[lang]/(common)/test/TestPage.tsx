'use client'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/hooks/useRedux'
import React from 'react'
import { setLoading } from '@/features/loading/loadingSlice'

type Props = {}

export default function TestPage({}: Props) {
  const dispatch = useAppDispatch()
  
  return (
    <div>
      
      <Button onClick={() => { dispatch(setLoading(true)) }}>Open Modal</Button>
    </div>
  )
}