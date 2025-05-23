"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

type ToastType = "default" | "destructive" | "success" | "warning" | "info"

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastType
  duration?: number
}

interface ToastOptions {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastType
  duration?: number
}

const TOAST_DURATION = 5000 // 5 seconds

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, action, variant = "default", duration = TOAST_DURATION }: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = {
        id,
        title,
        description,
        action,
        variant,
        duration,
      }

      setToasts((prevToasts) => [...prevToasts, newToast])

      return id
    },
    [],
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  // Auto-dismiss toasts after their duration
  useEffect(() => {
    if (toasts.length === 0) return

    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        dismiss(toast.id)
      }, toast.duration)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, dismiss])

  return {
    toasts,
    toast,
    dismiss,
    dismissAll,
  }
}
