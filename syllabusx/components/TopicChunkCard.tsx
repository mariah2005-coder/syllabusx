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
    <section className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm">
      <header className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </header>

      <div>
        {children ? (
          children
        ) : cards ? (
          <FlashcardGrid cards={cards} onKnown={onKnown} onReview={onReview} />
        ) : null}
      </div>
    </section>
  );
};

export default TopicChunkCard;
