'use client'
import { NavLink } from '@/components/NavLink'
import clsx from 'clsx'
import { useState, useEffect } from 'react'

import type { IconType } from 'react-icons'

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  render: JSX.Element
  type?: 'click' | 'hover'
  position?: 'bottomLeft' | 'bottomRight'
  children: React.ReactNode
  width?: string
}

interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  to?: string
  icon?: IconType
  disabled?: boolean
  onItemClick?: () => void
}

export default function Dropdown({
  className,
  render,
  type = 'click',
  position = 'bottomLeft',
  children,
  width = 'w-[260px]',
}: DropdownProps): JSX.Element {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isMouseInside = !!(e.target as HTMLDivElement).closest(
        'div[data-name="dropdown"]'
      )
      !isMouseInside && setIsShown(false)
    }
    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleShow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsShown(true)
  }

  const typeProps =
    type === 'click' ? { onClick: handleShow } : { onMouseEnter: handleShow }

  return (
    <div
      data-name="dropdown"
      className={`relative flex items-center cursor-pointer ${className}`}
      {...typeProps}
    >
      {render}
      {isShown && (
        <div
          className={`absolute ${width} z-50 bg-white shadow-md border-2 border-slate-200 rounded py-2 ${positions[position]}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

Dropdown.Header = function ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={`px-6 ${className}`}>{children}</div>
}

Dropdown.Item = function ({
  className,
  to,
  icon,
  disabled = false,
  children,
  onItemClick,
}: DropdownItemProps): JSX.Element {
  const classUtils = clsx(className, 'flex items-center h-10 px-6 ', {
    'hover:bg-emerald-400 hover:text-white cursor-pointer': !disabled,
    'opacity-50': disabled,
  })

  const handleClick = () => {
    onItemClick && !disabled && onItemClick()
  }

  const Icon = icon as IconType

  const content = (
    <>
      {icon && <Icon className="w-5 h-5 mr-4" />}
      {children}
    </>
  )

  return to ? (
    <NavLink href={to} className={classUtils}>
      {content}
    </NavLink>
  ) : (
    <div className={classUtils} onClick={handleClick}>
      {content}
    </div>
  )
}

Dropdown.Divider = function Divider(): JSX.Element {
  return <div className="flex-none my-2 border-t-2 border-slate-200"></div>
}

const positions = {
  bottomLeft: 'top-full',
  bottomRight: 'top-full right-0',
}
