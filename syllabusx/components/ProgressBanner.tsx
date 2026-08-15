import React from "react";

export interface ProgressBannerProps {
  title: string;
  message?: string;
}

export const ProgressBanner: React.FC<ProgressBannerProps> = ({ title, message }) => {
  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {message ? <p className="text-sm leading-6 text-slate-600">{message}</p> : null}
      </div>
    </div>
  );
};

export default ProgressBanner;
