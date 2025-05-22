import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between mb-2 text-sm">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
