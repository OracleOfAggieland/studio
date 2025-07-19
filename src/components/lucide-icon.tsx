"use client";

import { icons, type LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    const FallbackIcon = icons['Sparkles'];
    return <FallbackIcon {...props} />;
  }
  return <LucideIcon {...props} />;
};
