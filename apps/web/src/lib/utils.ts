import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserAvatarUrl(
  iconName: string | undefined | null,
): string | undefined {
  if (!iconName || iconName.includes('default')) {
    return undefined;
  }
  // Maps "icon-1" to "/icon1.png"
  return `/${iconName.replace('-', '')}.png`;
}
