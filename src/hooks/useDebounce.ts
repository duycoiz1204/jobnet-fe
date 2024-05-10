import { useState, useEffect } from 'react'

export default function useDebounce<T>(value: T, delay = 240) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(id)
  }, [value, delay])

  return debouncedValue
}
