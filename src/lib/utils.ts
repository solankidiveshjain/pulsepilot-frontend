import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility for merging Tailwind CSS classes using clsx and tailwind-merge.
 * This prevents class conflicts and provides a cleaner API for conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
