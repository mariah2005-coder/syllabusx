"use client";

import React from "react";
import FlashcardCard from "./FlashcardCard";
import type { Flashcard } from "../types/flashcard";

export interface FlashcardGridProps {
  cards: Flashcard[];
  onKnown?: (id: string) => void;
  onReview?: (id: string) => void;
}

export const FlashcardGrid: React.FC<FlashcardGridProps> = ({
  cards,
  onKnown,
  onReview,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cards.map((c) => (
        <FlashcardCard key={c.id} card={c} onKnown={onKnown} onReview={onReview} />
      ))}
    </div>
  );
};

export default FlashcardGrid;
