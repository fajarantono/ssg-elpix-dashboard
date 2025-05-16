'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './_components/LoginForm';
import Image from 'next/image';

const pageVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export default function LoginPage() {
  return (
    <AnimatePresence>
      <motion.div
        className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          <div className="hidden md:flex w-1/2 h-full relative p-3">
            <div className="flex flex-col justify-between w-full h-full">
              <Image
                src="/images/background/auth-bg.jpeg"
                alt="Login Background"
                fill
                className="relative object-cover rounded-r-3xl dark:hidden"
                priority
              />
              <Image
                src="/images/background/auth-bg-dark.png"
                alt="Login Background"
                fill
                className="relative object-cover rounded-r-3xl dark:block"
                priority
              />
              <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10">
                <Image
                  src="/images/logo/logo-icon.png"
                  alt="eLPix AI Logo"
                  width={20}
                  height={20}
                  className="object-contain dark:block"
                />
                <Image
                  src="/images/logo/logo-icon-black.png"
                  alt="eLPix AI Logo"
                  width={20}
                  height={20}
                  className="object-contain dark:hidden"
                />
                <p className="text-black-500 text-xl font-medium  dark:text-white">
                  Powered by <span className="font-semibold">eLPix AI</span>
                </p>
              </div>
            </div>
          </div>

          <div className="content-center lg:w-1/2 w-full">
            <LoginForm />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
