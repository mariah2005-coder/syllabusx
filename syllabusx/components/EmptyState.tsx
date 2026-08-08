"use client";

import React from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  description = "Start by adding some items to see them here.",
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-md bg-white border border-gray-100">
      <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        {icon ?? (
          <svg
            className="h-8 w-8 text-sky-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12a7 7 0 0114 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 text-center max-w-xs">{description}</p>
    </div>
  );
};

export default EmptyState;
