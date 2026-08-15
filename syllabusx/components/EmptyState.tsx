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
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-slate-50 border border-slate-200 p-10 text-center">
      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
        {icon ?? (
          <svg
            className="h-8 w-8 text-slate-500"
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
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="max-w-md text-sm leading-7 text-slate-700">{description}</p>
    </div>
  );
};

export default EmptyState;
