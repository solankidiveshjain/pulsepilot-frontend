"use client";

import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
}

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, src, alt, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {src ? (
        <AvatarPrimitive.Image
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full"
        />
      ) : (
        <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <span className="text-sm font-medium text-muted-foreground">
            {alt?.[0]?.toUpperCase() || "U"}
          </span>
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  )
);

Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
