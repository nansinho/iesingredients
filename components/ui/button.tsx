import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white text-sm hover:bg-[var(--color-charcoal)] shadow-sm",
        accent: "bg-brand-accent text-white text-sm hover:bg-brand-accent-hover shadow-sm",
        light: "bg-[var(--color-cream-light)] text-[var(--color-charcoal)] text-sm hover:bg-[var(--color-cream)]",
        outline: "border border-brand-primary/15 text-[var(--color-charcoal)] text-sm hover:bg-brand-primary/5",
        "outline-dark": "border border-brand-primary text-brand-primary text-sm hover:bg-brand-primary hover:text-white",
        "outline-light": "border border-white/40 text-white text-sm hover:border-white hover:bg-white/10",
        "outline-sage": "border border-brand-secondary text-brand-secondary text-sm hover:bg-brand-secondary hover:text-brand-accent-light",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-[var(--color-cream-light)] hover:text-[var(--color-charcoal)]",
        link: "text-[var(--color-charcoal)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-[15px]",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
