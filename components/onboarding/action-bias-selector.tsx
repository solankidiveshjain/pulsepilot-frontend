"use client"

interface ActionBiasSelectorProps {
  value: string
  onChange: (value: string) => void
}

const actionBiasOptions = [
  {
    id: "engage",
    label: "Engage more",
    description: "Focus on building relationships and encouraging conversation",
  },
  {
    id: "redirect",
    label: "Redirect to Help",
    description: "Guide users to resources, documentation, or support channels",
  },
  {
    id: "inform",
    label: "Inform only",
    description: "Provide factual information without additional engagement",
  },
  {
    id: "apologize",
    label: "Apologize smartly",
    description: "Address concerns with empathy and offer solutions",
  },
]

export function ActionBiasSelector({ value, onChange }: ActionBiasSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {actionBiasOptions.map((option) => (
        <div
          key={option.id}
          className={`action-bias-card ${value === option.id ? "action-bias-active" : "action-bias-inactive"}`}
          onClick={() => onChange(option.id)}
        >
          <h4 className="font-medium mb-1">{option.label}</h4>
          <p className="text-xs text-muted-foreground">{option.description}</p>
        </div>
      ))}
    </div>
  )
}
