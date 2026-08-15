import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm font-bold leading-tight",
  {
    variants: {
      variant: {
        neutral: "bg-sand text-ink",
        brick: "bg-brick text-white",
        ink: "bg-ink text-cream",
        outline: "border border-stone text-ink",
        attention: "border-2 border-attention bg-white text-ink",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
