"use client";

import React from "react";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-start justify-center py-10 px-4">
      <main className="w-full max-w-4xl bg-white dark:bg-black rounded-lg shadow-sm p-8">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
