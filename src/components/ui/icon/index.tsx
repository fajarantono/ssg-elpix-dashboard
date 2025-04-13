import React from "react";
import { LucideProps, CircleDot } from 'lucide-react';
import * as LucideIcons from "lucide-react";

type IconProps = {
  name: string;
  size?: number;
  className?: string;
} & LucideProps;

const Icon: React.FC<IconProps> = ({ name, size = 24, className, ...props }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (LucideIcons as any)[name] || CircleDot;

  // if (!LucideIcon) {
  //   console.warn(`Icon "${name}" tidak ditemukan di lucide-react.`); // Debugging
  //   return null;
  // }

  return <LucideIcon size={size} className={className} {...props} />;
};

export default Icon;
