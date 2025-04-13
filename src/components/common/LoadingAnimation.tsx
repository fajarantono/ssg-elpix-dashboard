"use client";
import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[999999]">
      <div className="h-full bg-brand-500 animate-loading"></div>
    </div>
  );
};

export default LoadingAnimation;
