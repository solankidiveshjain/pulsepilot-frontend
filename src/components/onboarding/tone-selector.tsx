"use client"
import { cn } from "@/lib/utils"

interface ToneSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

interface ToneOption {
  value: string
  label: string
  description: string
  emoji: string
}

const tones: ToneOption[] = [
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm and welcoming",
    emoji: "😊",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Formal and structured",
    emoji: "👔",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed and conversational",
    emoji: "🤙",
  },
  {
    value: "enthusiastic",
    label: "Enthusiastic",
    description: "Excited and positive",
    emoji: "🎉",
  },
]

export function ToneSelector({ value, onChange, className }: ToneSelectorProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {tones.map((tone) => (
        <div
          key={tone.value}
          className={cn(
            "flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all",
            value === tone.value
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/30 hover:bg-primary/5",
          )}
          onClick={() => onChange(tone.value)}
        >
          <span className="text-2xl mb-1">{tone.emoji}</span>
          <h3 className="font-medium">{tone.label}</h3>
          <p className="text-xs text-muted-foreground text-center mt-1">{tone.description}</p>
        </div>
      ))}
    </div>
  )
}
