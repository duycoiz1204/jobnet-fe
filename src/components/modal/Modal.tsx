'use client';

import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const theme = {
  root: {
    base: 'fixed w-screen z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full',
  },
  show: {
    on: 'flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80',
    off: 'hidden',
  },
  sizes: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    '8xl': 'max-w-8xl',
  },
  positions: {
    center: 'items-center justify-center',
  },
  content: {
    base: 'relative h-full w-full p-4 md:h-auto',
    inner:
      'relative rounded-lg bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]',
  },
  header: {
    base: 'flex items-start justify-between rounded-t dark:border-gray-600 border-b',
    popup: {
      on: 'p-2 border-b-0',
      off: 'p-5',
    },
    title: 'text-xl font-medium text-gray-900 dark:text-white',
    close: {
      base: 'ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white',
      icon: 'h-5 w-5',
    },
  },
  body: {
    base: 'p-6 flex-1 overflow-auto',
    popup: 'pt-0',
  },
  footer: {
    base: 'flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600',
    popup: 'border-t',
  },
};

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean;
  size?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl';
  position?: 'center';
  popup?: boolean;
  onClose?: () => void;
}

type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;
type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

const ModalContext = createContext<{
  popup?: boolean;
  onClose?: () => void;
}>({});

export default function Modal({
  show = false,
  size = 'md',
  position = 'center',
  className,
  children,
  popup = false,
  onClose = () => null,
}: ModalProps) {
  const modalUtils = cn(
    className,
    theme.root.base,
    show ? theme.show.on : theme.show.off,
    theme.positions[position]
  );
  const contentUtils = cn(theme.content.base, theme.sizes[size]);
  const innerUtils = theme.content.inner;

  return (
    <ModalContext.Provider
      value={{
        popup,
        onClose,
      }}
    >
      <div className={modalUtils}>
        <div className={contentUtils}>
          <div className={innerUtils}>{children}</div>
        </div>
      </div>
    </ModalContext.Provider>
  );
}

Modal.Header = function Header({ className, children }: ModalHeaderProps) {
  const context = useContext(ModalContext);
  const headerUtils = cn(
    className,
    theme.header.base,
    context.popup ? theme.header.popup.on : theme.header.popup.off
  );
  const titleUtils = cn(theme.header.title);
  const closeUtils = cn(theme.header.close.base);
  const iconUtils = cn(theme.header.close.icon);

  return (
    <div className={headerUtils}>
      <div className={titleUtils}>{children}</div>
      <div className={closeUtils} onClick={context.onClose}>
        <X className={iconUtils} />
      </div>
    </div>
  );
};

Modal.Body = function Body({ className, children }: ModalBodyProps) {
  const context = useContext(ModalContext);
  const bodyUtils = cn(
    className,
    theme.body.base,
    context.popup ? theme.body.popup : ''
  );

  return <div className={bodyUtils}>{children}</div>;
};

Modal.Footer = function Footer({ className, children }: ModalFooterProps) {
  const context = useContext(ModalContext);

  const footerUtils = cn(
    className,
    theme.footer.base,
    context.popup ? theme.footer.popup : ''
  );

  return <div className={footerUtils}>{children}</div>;
};
