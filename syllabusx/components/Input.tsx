"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = "", ...rest }, ref) => {
    const inputClasses =
      "w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus:border-sky-300 transition-colors";

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        ) : null}
        <input id={id} ref={ref} className={`${inputClasses} ${className}`.trim()} {...rest} />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
