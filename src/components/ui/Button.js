import React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
      outline: "border-2 border-orange-500 bg-transparent text-orange-500 hover:bg-orange-500 hover:text-white shadow-md hover:shadow-lg",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md",
      ghost: "hover:bg-orange-50 hover:text-orange-600 transition-colors",
      link: "text-orange-500 underline-offset-4 hover:underline hover:text-orange-600"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      xl: "h-12 rounded-lg px-10 text-base",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
};

const getButtonClasses = (variant, size, className) => {
  const baseClasses = buttonVariants.base;
  const variantClasses = buttonVariants.variants.variant[variant] || buttonVariants.variants.variant.default;
  const sizeClasses = buttonVariants.variants.size[size] || buttonVariants.variants.size.default;
  
  return cn(baseClasses, variantClasses, sizeClasses, className);
};

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false, 
  ...props 
}, ref) => {
  const Comp = asChild ? "span" : "button";
  
  return (
    <Comp
      className={getButtonClasses(variant, size, className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
