import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-primary/10 text-brand-primary",
        secondary:
          "border-transparent bg-gray-100 text-gray-600",
        destructive:
          "border-transparent bg-red-50 text-red-600",
        outline:
          "border-current/20 text-foreground",
        success:
          "border-transparent bg-emerald-50 text-emerald-700",
        warning:
          "border-transparent bg-amber-50 text-amber-700",
        press:
          "border-brand-accent/15 bg-brand-accent/8 text-brand-accent",
        news:
          "border-blue-200 bg-blue-50 text-blue-700",
        events:
          "border-purple-200 bg-purple-50 text-purple-700",
        trends:
          "border-amber-200 bg-amber-50 text-amber-700",
        cosmetique:
          "border-cosmetique/20 bg-cosmetique/10 text-cosmetique-dark",
        parfumerie:
          "border-parfum/20 bg-parfum/10 text-parfum-dark",
        arome:
          "border-arome/20 bg-arome/10 text-arome-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
