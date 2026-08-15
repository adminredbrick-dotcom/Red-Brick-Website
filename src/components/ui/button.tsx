import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-bold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brick text-white hover:bg-brick-deep",
        secondary: "bg-ink text-cream hover:bg-brick-deep",
        outline: "border-2 border-ink bg-transparent text-ink hover:bg-sand",
        ghost: "text-ink hover:bg-sand",
        link: "text-brick underline underline-offset-4 hover:text-brick-deep",
      },
      size: {
        default: "min-h-12 px-5 py-3 text-base",
        sm: "min-h-11 px-4 py-2 text-base",
        lg: "min-h-14 px-7 py-3.5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
