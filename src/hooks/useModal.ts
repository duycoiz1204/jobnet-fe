import { useState } from 'react'

export default function useModal() {
  const [modal, setModal] = useState<string | undefined>(undefined)

  const openModal = (id: string) => setModal(id)
  const closeModal = () => setModal(undefined)

  return {
    modal,
    openModal,
    closeModal,
  }
}
