import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg",
        destructive: "rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-xl hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium variants - rectangulaires professionnels
        "premium-solid": "rounded-xl bg-forest-950 text-white hover:bg-forest-900 font-semibold shadow-lg hover:shadow-xl",
        "premium-outline": "rounded-xl border-2 border-forest-950 text-forest-950 bg-transparent hover:bg-forest-950 hover:text-white font-medium",
        "premium-light": "rounded-xl bg-white text-forest-950 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl",
        "premium-light-outline": "rounded-xl border-2 border-white text-white bg-white/10 hover:bg-white hover:text-forest-950 font-medium",
        // Legacy variants
        hero: "rounded-xl bg-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        "hero-outline": "rounded-xl border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground",
        premium: "rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg",
        subtle: "rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
        // Dark background variants
        "outline-light": "rounded-xl border-2 border-gold-400 text-gold-400 bg-transparent hover:bg-gold-500 hover:text-forest-950 hover:border-gold-500",
        "ghost-light": "rounded-xl text-white/80 hover:text-white hover:bg-white/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
