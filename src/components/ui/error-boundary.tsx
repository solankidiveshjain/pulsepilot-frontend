"use client"

import type React from "react"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-destructive/5 rounded-lg border border-destructive/20">
      <div className="flex items-center gap-2 text-destructive mb-4">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-medium">Something went wrong</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4 max-w-md text-center">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button variant="outline" onClick={resetErrorBoundary} className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
}
