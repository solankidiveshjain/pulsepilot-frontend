"use client"

import { CheckIcon } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`progress-step ${
                index + 1 === currentStep
                  ? "progress-step-active"
                  : index + 1 < currentStep
                    ? "progress-step-completed"
                    : "progress-step-inactive"
              }`}
            >
              {index + 1 < currentStep ? <CheckIcon className="h-4 w-4" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`progress-line ${index + 1 < currentStep ? "progress-line-active" : ""}`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Profile Setup</span>
        <span>Connect Accounts</span>
      </div>
    </div>
  )
}
