'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { useMenu } from '@/context/MenuContext';
import { ChevronDownIcon, HorizontaLDots } from '../icons/index';
import Icon from '@/components/ui/icon';

const SkeletonMenu = () => (
  <ul className="flex flex-col gap-4">
    {[...Array(12)].map((_, index) => (
      <li key={index} className="flex items-center gap-3 animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 h-6 w-6 rounded-md"></div>
        <div
          className={`bg-gray-200 dark:bg-gray-700 h-6 rounded-md ${
            index % 2 === 0 ? 'w-3/4' : 'w-1/2'
          }`}
        ></div>
      </li>
    ))}
  </ul>
);

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { menu, isLoading } = useMenu();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname || path.startsWith(pathname), [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    menu.forEach((nav) => {
      if (
        nav.children &&
        nav.children.length > 0 &&
        nav.children.some((subItem) => isActive(subItem.url))
      ) {
        setOpenSubmenu(nav.id);
        submenuMatched = true;
      }
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive, menu]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const ref = subMenuRefs.current[openSubmenu];
      if (ref) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [openSubmenu]: ref.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (id: string) => {
    setOpenSubmenu((prev) => (prev === id ? null : id));
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200  ${
        isExpanded || isMobileOpen
          ? 'w-[290px]'
          : isHovered
          ? 'w-[290px]'
          : 'w-[90px]'
      } ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link href="/">
          <Image
            src={
              isExpanded || isHovered
                ? '/images/logo/logo.svg'
                : '/images/logo/elpix-ai-black.svg'
            }
            alt="Logo"
            width={isExpanded || isHovered ? 150 : 50}
            height={40}
            priority
            className="dark:hidden"
          />
          <Image
            src="/images/logo/logo-dark.svg"
            alt="Logo"
            width={150}
            height={40}
            priority
            className="hidden dark:block"
          />
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {isLoading ? (
                <SkeletonMenu />
              ) : (
                <ul className="flex flex-col gap-4">
                  {menu.map((nav) => (
                    <li key={nav.id}>
                      {nav.children && nav.children.length > 0 ? (
                        <button
                          onClick={() => handleSubmenuToggle(nav.id)}
                          className={`menu-item group ${
                            openSubmenu === nav.id
                              ? 'menu-item-active'
                              : 'menu-item-inactive'
                          }`}
                        >
                          {nav.icon && (
                            <span className="menu-item-icon">
                              <Icon
                                name={nav.icon}
                                size={24}
                                className="text-gray-500"
                              />
                            </span>
                          )}
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="menu-item-text">{nav.name}</span>
                          )}
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <ChevronDownIcon
                              className={`ml-auto w-5 h-5 ${
                                openSubmenu === nav.id ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>
                      ) : (
                        <Link
                          href={nav.url}
                          className={`menu-item group ${
                            isActive(nav.url)
                              ? 'menu-item-active'
                              : 'menu-item-inactive'
                          }`}
                        >
                          {nav.icon && (
                            <span className="menu-item-icon">
                              <Icon
                                name={nav.icon}
                                size={24}
                                className="text-gray-500"
                              />
                            </span>
                          )}
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="menu-item-text">{nav.name}</span>
                          )}
                        </Link>
                      )}
                      {nav.children &&
                        nav.children.length > 0 &&
                        (isExpanded || isHovered || isMobileOpen) && (
                          <div
                            ref={(el) => {
                              subMenuRefs.current[nav.id] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                              height:
                                openSubmenu === nav.id
                                  ? `${subMenuHeight[nav.id]}px`
                                  : '0px',
                            }}
                          >
                            <ul className="mt-2 space-y-1 ml-9">
                              {nav.children.map((subItem) => (
                                <li key={subItem.id}>
                                  <Link
                                    href={subItem.url}
                                    className={`menu-dropdown-item ${
                                      isActive(subItem.url)
                                        ? 'menu-dropdown-item-active'
                                        : 'menu-dropdown-item-inactive'
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
