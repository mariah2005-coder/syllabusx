"use client";

import React from "react";

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title = "SyllabusX",
  subtitle = "Turn your syllabus into simple study cards, one topic at a time.",
}) => {
  return (
    <header className="mb-8 space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="max-w-2xl text-sm leading-7 text-slate-700">{subtitle}</p>
    </header>
  );
};

export default PageHeader;
