import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-full",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-full",
        outline:
          "border border-brown/30 bg-background shadow-sm hover:bg-cream hover:text-dark rounded-full",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-full",
        ghost: "hover:bg-brown/10 hover:text-dark rounded-full",
        link: "text-brown underline-offset-4 hover:underline",
        peach:
          "bg-olive-bright text-white shadow-md shadow-olive-bright/20 hover:bg-lime hover:shadow-lg hover:shadow-olive-bright/30 hover:scale-[1.02] active:scale-[0.98] rounded-full",
        "outline-brown":
          "border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white hover:scale-[1.02] active:scale-[0.98] rounded-full",
        premium:
          "bg-dark text-cream-light shadow-md hover:bg-dark-lighter hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] rounded-full",
        blush:
          "bg-olive-bright text-white shadow-md shadow-olive-bright/20 hover:bg-lime hover:shadow-lg hover:shadow-olive-bright/30 hover:scale-[1.02] active:scale-[0.98] rounded-full",
      },
      size: {
        default: "h-10 px-5 py-2",
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
