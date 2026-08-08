"use client";

import React, { useState, KeyboardEvent } from "react";
import Button from "./Button";
import type { Flashcard } from "../types/flashcard";

export interface FlashcardCardProps {
  card: Flashcard;
  onKnown?: (id: string) => void;
  onReview?: (id: string) => void;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({
  card,
  onKnown = () => {},
  onReview = () => {},
}) => {
  const [revealed, setRevealed] = useState(false);

  function toggleReveal() {
    setRevealed((v) => !v);
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleReveal();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggleReveal}
      onKeyDown={onKey}
      aria-expanded={revealed}
      className="group cursor-pointer select-none bg-white border border-gray-100 rounded-lg shadow-sm p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
    >
      <div className="mb-2">
        <h4 className="text-sm font-semibold text-gray-800">{card.question}</h4>
      </div>

      <div
        className={`mt-2 transition-all duration-150 ${
          revealed ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        } overflow-hidden`}
      >
        <p className="text-sm text-gray-700 mb-4">{card.answer}</p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              onKnown(card.id as unknown as string);
            }}
          >
            I knew this
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onReview(card.id as unknown as string);
            }}
          >
            Needs review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCard;
