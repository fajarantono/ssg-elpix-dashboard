'use client';

import { AbilityProvider } from '@/context/AbilityContext';
import { MenuProvider } from '@/context/MenuContext';
import { useSidebar } from '@/context/SidebarContext';
import AppHeader from '@/layout/AppHeader';
import AppSidebar from '@/layout/AppSidebar';
import Backdrop from '@/layout/Backdrop';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const pageVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  let mainContentMargin = '';

  if (isMobileOpen) {
    mainContentMargin = 'ml-0';
  } else if (isExpanded || isHovered) {
    mainContentMargin = 'lg:ml-[290px]';
  } else {
    mainContentMargin = 'lg:ml-[90px]';
  }

  return (
    <div className="min-h-screen xl:flex">
      <AbilityProvider> 
        <MenuProvider>
          <AppSidebar />
          <Backdrop />
          {/* Main Content Area */}
          <div
            className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
          >
            {/* Header */}
            <AppHeader />
            {/* Page Content */}
            <AnimatePresence>
              <motion.div 
                className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </MenuProvider>
      </AbilityProvider> 
    </div>
  );
}
