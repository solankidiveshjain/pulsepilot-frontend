"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to detect if the current viewport is mobile
 * @param breakpoint - The breakpoint to consider as mobile (default: 768px)
 * @returns boolean indicating if the current viewport is mobile
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    // Function to check if the window width is less than the breakpoint
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [breakpoint])

  return isMobile
}
