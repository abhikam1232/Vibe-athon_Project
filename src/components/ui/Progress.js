import React from "react";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ease-out shadow-sm"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
    </div>
  </div>
));
Progress.displayName = "Progress";

export { Progress };
