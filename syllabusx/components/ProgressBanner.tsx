"use client";

import React from "react";

export interface ProgressBannerProps {
  title: string;
  message?: string;
}

export const ProgressBanner: React.FC<ProgressBannerProps> = ({ title, message }) => {
  return (
    <div className="w-full rounded-md bg-white border border-gray-100 p-3 mb-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-sky-50 text-sky-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v3a1 1 0 00.293.707l2 2A1 1 0 0012 11h.01a1 1 0 00-.01-1.414L11 8.586z" clipRule="evenodd" />
          </svg>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-800">{title}</div>
          {message ? <div className="text-xs text-gray-500">{message}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default ProgressBanner;
