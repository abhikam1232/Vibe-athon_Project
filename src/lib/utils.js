import { clsx } from "clsx"

export function cn(...inputs) {
  return clsx(inputs)
}

export function cva(base, config) {
  return (props) => {
    if (!props) return base;
    
    const { variants = {}, defaultVariants = {} } = config;
    const mergedProps = { ...defaultVariants, ...props };
    
    let classes = base;
    
    Object.entries(mergedProps).forEach(([key, value]) => {
      if (variants[key] && variants[key][value]) {
        classes += ` ${variants[key][value]}`;
      }
    });
    
    return classes;
  };
}
