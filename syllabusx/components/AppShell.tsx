import React from "react";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 px-4">
      <main className="w-full max-w-3xl flex-1 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
        {children}
      </main>

      <footer className="w-full mt-6 text-center text-sm text-slate-600">
        <div className="max-w-3xl mx-auto">© 2026 SyllabusX</div>
      </footer>
    </div>
  );
};

export default AppShell;
