'use client';
import { useState, createContext, useContext } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from 'react-icons/tb';

import type { IconType } from 'react-icons';
import clsx from 'clsx';
import { NavLink } from '@/components/NavLink';
import Image from 'next/image';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

interface SidebarLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  img?: string;
}

type SidebarItemsProps = React.HTMLAttributes<HTMLDivElement>;
type SidebarItemGroupProps = React.HTMLAttributes<HTMLDivElement>;

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  to?: string;
  end?: boolean;
  icon: IconType;
  onClick?: () => void;
}

interface SidebarCollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  icon: IconType;
}

const theme = {
  sidebar: {
    base: ' h-full p-4 bg-slate-50 transition-all',
    icon: {
      base: 'w-5 h-5 text-slate-500',
      collapse: {
        on: '',
        off: 'mr-4',
      },
    },
    collapse: {
      on: 'w-fit ',
      off: 'w-[280px]',
      itemGroup: 'pl-[50px]',
    },
  },
  logo: {
    base: 'flex items-center mb-5 text-2xl font-bold text-slate-500',
    img: {
      base: 'text-slate-500',
      collapse: {
        on: 'h-9',
        off: 'h-10 mr-4',
      },
    },
  },
  items: {
    base: 'divide-y-2',
  },
  itemGroup: { base: 'space-y-2 py-4  first:pt-0 last:pb-0 ' },
  item: {
    base: 'flex items-center justify-between p-2 rounded-lg font-semibold hover:bg-emerald-400 hover:text-white transition-all',
    active: {
      on: 'bg-emerald-400 text-white',
      off: 'text-slate-900',
    },
    itemCollapse: 'pl-5',
  },
};

const SidebarContext = createContext<{
  isCollapse: boolean;
  setIsCollapse: (isCollapse: boolean) => void;
}>({
  isCollapse: false,
  setIsCollapse: () => undefined,
});

const SidebarCollapseContext = createContext({
  isInCollapse: false,
});

export default function Sidebar({
  className = '',
  children,
}: SidebarProps): JSX.Element {
  const [isCollapse, setIsCollapse] = useState(false);

  const handleChangeCollapse = () => setIsCollapse((prev) => !prev);

  const CollapseIcon = (
    isCollapse ? TbLayoutSidebarLeftExpand : TbLayoutSidebarLeftCollapse
  ) as IconType;
  const baseUtils = clsx(
    className,
    theme.sidebar.base,
    isCollapse ? theme.sidebar.collapse.on : theme.sidebar.collapse.off
  );
  const iconUtils = theme.sidebar.icon.base;

  return (
    <SidebarContext.Provider
      value={{
        isCollapse,
        setIsCollapse,
      }}
    >
      <div className={baseUtils}>
        <div
          className="absolute p-1 rounded top-2 -right-7 bg-slate-200"
          onClick={handleChangeCollapse}
        >
          <CollapseIcon className={iconUtils} />
        </div>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

Sidebar.Logo = function SidebarLogo({
  className = '',
  img = '',
  children,
}: SidebarLogoProps): JSX.Element {
  const { isCollapse } = useContext(SidebarContext);

  const baseUtils = clsx(className, theme.logo.base);
  const imgUtils = clsx(
    theme.logo.img.base,
    isCollapse ? theme.logo.img.collapse.on : theme.logo.img.collapse.off
  );

  return (
    <div className={baseUtils}>
      {img && (
        <Image
          width={500}
          height={500}
          alt=""
          src={img}
          className={imgUtils}
        />
      )}
      {!isCollapse && children}
    </div>
  );
};

Sidebar.Items = function SidebarItems({
  children,
}: SidebarItemsProps): JSX.Element {
  const baseUtils = theme.items.base;

  return <div className={baseUtils}>{children}</div>;
};

Sidebar.ItemGroup = function SidebarItemGroup({
  className = '',
  children,
}: SidebarItemGroupProps): JSX.Element {
  const baseUtils = clsx(className, theme.itemGroup.base);

  return <div className={baseUtils}>{children}</div>;
};

Sidebar.Item = function SidebarItem({
  className = '',
  to,
  end,
  icon,
  children,
  onClick,
}: SidebarItemProps): JSX.Element {
  const { isCollapse } = useContext(SidebarContext);
  const { isInCollapse } = useContext(SidebarCollapseContext);

  const Icon = icon;
  const baseUtils = clsx(
    className,
    theme.item.base,
    isInCollapse && !isCollapse ? theme.item.itemCollapse : ''
  );
  const iconUtils = clsx(
    theme.sidebar.icon.base,
    isCollapse
      ? theme.sidebar.icon.collapse.on
      : theme.sidebar.icon.collapse.off
  );

  const activeUtils = clsx(baseUtils, theme.item.active.on);
  const noActiveUtils = clsx(baseUtils, theme.item.active.off);

  const content = (
    <div className="flex items-center h-6" onClick={onClick}>
      <Icon className={iconUtils} />
      {!isCollapse && children}
    </div>
  );

  return to ? (
    <NavLink
      href={to}
      end={end}
      className={({ isActive }) => (isActive ? activeUtils : noActiveUtils)}
    >
      {content}
    </NavLink>
  ) : (
    <div className={baseUtils}>{content}</div>
  );
};

Sidebar.Collapse = function SidebarCollapse({
  className = '',
  label,
  icon,
  children,
}: SidebarCollapseProps): JSX.Element {
  const { isCollapse } = useContext(SidebarContext);

  const [isShown, setIsShown] = useState(false);

  const handleCollapseToggle = () => setIsShown((prevIsShown) => !prevIsShown);

  const Icon = icon;
  const ToggleIcon = (isShown ? FaAngleUp : FaAngleDown) as IconType;
  const baseUtils = clsx(className, theme.item.base);
  const iconUtils = clsx(
    theme.sidebar.icon.base,
    isCollapse
      ? theme.sidebar.icon.collapse.on
      : theme.sidebar.icon.collapse.off
  );

  const content = (
    <div className="flex items-center h-6">
      <Icon className={iconUtils} />
      {!isCollapse && label}
    </div>
  );

  return (
    <SidebarCollapseContext.Provider
      value={{
        isInCollapse: true,
      }}
    >
      <div className={baseUtils} onClick={handleCollapseToggle}>
        {content}
        {!isCollapse && <ToggleIcon className="w-4 h-4" />}
      </div>
      {isShown && children}
    </SidebarCollapseContext.Provider>
  );
};
