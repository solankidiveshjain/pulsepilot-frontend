"use client";

import { cn } from "@/lib/utils";
import NextImage from "next/image";

interface ImageProps extends React.ComponentProps<typeof NextImage> {
  className?: string;
}

export function Image({ className, ...props }: ImageProps) {
  return <NextImage className={cn("object-cover", className)} {...props} />;
}
