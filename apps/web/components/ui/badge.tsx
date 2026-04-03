import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-700",
        secondary: "bg-secondary-100 text-secondary-700",
        destructive: "bg-red-100 text-red-700",
        outline: "border border-gray-300 text-gray-700 bg-white",
        success: "bg-success-100 text-success-700",
        accent: "bg-accent-100 text-accent-700",
        bronze: "bg-amber-100 text-amber-800",
        silver: "bg-gray-200 text-gray-700",
        gold: "bg-yellow-100 text-yellow-800",
        platinum: "bg-indigo-100 text-indigo-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
