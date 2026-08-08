"use client";

import React from "react";
import type { Flashcard } from "../types/flashcard";
import FlashcardGrid from "./FlashcardGrid";

export interface TopicChunkCardProps {
  title: string;
  cards?: Flashcard[];
  children?: React.ReactNode;
  onKnown?: (id: string) => void;
  onReview?: (id: string) => void;
}

export const TopicChunkCard: React.FC<TopicChunkCardProps> = ({
  title,
  cards,
  children,
  onKnown,
  onReview,
}) => {
  return (
    <section className="bg-gray-50 border border-gray-100 rounded-lg p-4">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </header>

      <div>
        {children ? children : cards ? <FlashcardGrid cards={cards} onKnown={onKnown} onReview={onReview} /> : null}
      </div>
    </section>
  );
};

export default TopicChunkCard;
