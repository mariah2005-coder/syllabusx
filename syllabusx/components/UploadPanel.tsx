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
    <div className="w-full">
      <EmptyState
        title="Upload a PDF syllabus"
        description="Drop a PDF here or select a file to extract study material into flashcards."
      />

      <div className="mt-4 flex items-center gap-3">
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

        <p className="text-sm text-gray-500">or drag & drop is supported in future updates.</p>
      </div>
    </div>
  );
};

export default UploadPanel;
