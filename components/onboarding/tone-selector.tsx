"use client"

interface ToneSelectorProps {
  value: string
  onChange: (value: string) => void
}

const toneOptions = [
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "witty", label: "Witty" },
  { id: "empathetic", label: "Empathetic" },
]

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {toneOptions.map((tone) => (
        <button
          key={tone.id}
          type="button"
          className={`tone-pill ${value === tone.id ? "tone-pill-active" : "tone-pill-inactive"}`}
          onClick={() => onChange(tone.id)}
        >
          {tone.label}
        </button>
      ))}
    </div>
  )
}
