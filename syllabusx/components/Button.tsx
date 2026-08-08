"use client";

import React from "react";

type Variant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-300",
  secondary:
    "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 focus-visible:ring-gray-300",
  ghost:
    "bg-transparent text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-200",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...rest }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-white";

    const classes = `${base} ${variantClasses[variant]} ${className}`.trim();

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
