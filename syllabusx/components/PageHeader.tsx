"use client";

import React from "react";

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title = "SyllabusX",
  subtitle = "Study with focused flashcards organized by topic.",
}) => {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
    </header>
  );
};

export default PageHeader;
