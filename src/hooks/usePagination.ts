import { useState, useRef } from 'react'

import type PaginationType from '@/types/pagination'

export default function usePagination<T>(data: PaginationType<T>) {
  const [pagination, setPagination] = useState(data)
  const scrollIntoViewRef = useRef<HTMLDivElement>(null)

  const scrollIntoView = () => {
    const rect = scrollIntoViewRef.current?.getBoundingClientRect()
    rect &&
      window.scrollTo({
        top: rect.top + window.scrollY - 80,
        behavior: 'smooth',
      })
  }

  return {
    pagination,
    setPagination,
    scrollIntoView,
    scrollIntoViewRef,
  }
}
