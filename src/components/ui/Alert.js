import React from "react";
import { cn } from "../../lib/utils";

const alertVariants = {
  base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  variants: {
    variant: {
      default: "bg-white border-gray-200 text-gray-900 shadow-md",
      destructive: "border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600",
      success: "border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600",
      warning: "border-orange-200 bg-orange-50 text-orange-900 [&>svg]:text-orange-600"
    }
  },
  defaultVariants: {
    variant: "default"
  }
};

const getAlertClasses = (variant, className) => {
  const baseClasses = alertVariants.base;
  const variantClasses = alertVariants.variants.variant[variant] || alertVariants.variants.variant.default;
  
  return cn(baseClasses, variantClasses, className);
};

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={getAlertClasses(variant, className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
