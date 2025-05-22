import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind's class merging
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
