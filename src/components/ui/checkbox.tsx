"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, ...props }, ref) => {
    // Add a default onChange handler if checked is provided but onChange isn't
    const handleChange = onChange || (checked !== undefined ? () => {} : undefined);

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            className="peer absolute h-0 w-0 opacity-0"
            ref={ref}
            checked={checked}
            onChange={handleChange}
            {...props}
          />
          <div
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow-sm",
              "peer-checked:bg-primary peer-checked:text-primary-foreground",
              "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              "peer-focus-visible:ring-offset-2 ring-offset-background ring-primary peer-focus-visible:outline-none peer-focus-visible:ring-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              className
            )}
            data-state={checked ? "checked" : "unchecked"}
          >
            {checked && <CheckIcon className="h-3 w-3 text-white" />}
          </div>
        </div>
        {label && <label className="text-sm">{label}</label>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
