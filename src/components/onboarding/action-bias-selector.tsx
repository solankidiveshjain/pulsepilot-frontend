"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionBiasSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

interface ActionBiasOption {
  value: string
  label: string
  description: string
}

const options: ActionBiasOption[] = [
  {
    value: "engage",
    label: "Engage",
    description: "Focus on building relationships and conversation",
  },
  {
    value: "convert",
    label: "Convert",
    description: "Focus on directing followers to take specific actions",
  },
  {
    value: "educate",
    label: "Educate",
    description: "Focus on providing valuable information and insights",
  },
]

export function ActionBiasSelector({ value, onChange, className }: ActionBiasSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {options.map((option) => (
        <div
          key={option.value}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
            value === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30",
          )}
          onClick={() => onChange(option.value)}
        >
          <div
            className={cn(
              "mt-0.5 shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center",
              value === option.value ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground",
            )}
          >
            {value === option.value && <Check className="h-3.5 w-3.5" />}
          </div>
          <div>
            <h3 className="font-medium leading-tight">{option.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
