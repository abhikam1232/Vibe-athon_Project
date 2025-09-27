import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      default: "border-transparent bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md hover:shadow-lg",
      secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
      destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
      outline: "border-orange-500 text-orange-600 hover:bg-orange-50",
      success: "border-transparent bg-green-500 text-white hover:bg-green-600",
      warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600"
    }
  },
  defaultVariants: {
    variant: "default"
  }
};

const getBadgeClasses = (variant, className) => {
  const baseClasses = badgeVariants.base;
  const variantClasses = badgeVariants.variants.variant[variant] || badgeVariants.variants.variant.default;
  
  return cn(baseClasses, variantClasses, className);
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <div 
      className={getBadgeClasses(variant, className)} 
      {...props} 
    />
  );
}

export { Badge, badgeVariants };
