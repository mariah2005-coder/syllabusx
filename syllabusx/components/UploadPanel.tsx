"use client";

import React from "react";
import Button from "./Button";
import EmptyState from "./EmptyState";

export interface UploadPanelProps {
  onFileSelected: (file: File) => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ onFileSelected }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full space-y-6">
      <EmptyState
        title="Upload a PDF syllabus"
        description="Select a PDF to convert into focused flashcards. Keep text simple and easy to review."
      />

      <div className="flex flex-col items-start gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelected(f);
          }}
        />

        <Button
          type="button"
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
        >
          Select PDF
        </Button>

        <p className="max-w-xl text-sm leading-6 text-slate-600">
          One step at a time: choose a file, then wait for the guided flashcard summary.
        </p>
      </div>
    </div>
  );
};

export default UploadPanel;
