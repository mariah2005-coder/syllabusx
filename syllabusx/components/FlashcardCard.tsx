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
  const [showDetail, setShowDetail] = useState(false);

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
      className="group cursor-pointer select-none rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 flex flex-col h-full"
    >
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-base font-semibold text-slate-900 leading-7">{card.question}</h4>
          {card.status !== "unreviewed" ? (
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {card.status === "known" ? "Known" : "Needs review"}
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 flex flex-col flex-1 min-h-0 ${
          revealed ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        }`}
      >
        <div className="mb-5">
          <p className="text-sm leading-7 text-slate-700">{card.answer}</p>

          {card.detail ? (
            <div className="mb-4">
              {!showDetail ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowDetail(true);
                  }}
                  className="text-sm text-sky-600 underline"
                >
                  Show more detail
                </button>
              ) : (
                <div className="text-sm leading-7 text-slate-700 mb-4">
                  <p>{card.detail}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowDetail(false);
                    }}
                    className="mt-2 text-sm text-slate-600 underline"
                  >
                    Show less
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row mt-auto">
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("FlashcardCard: I knew this clicked", card.id);
              onKnown?.(card.id as unknown as string);
            }}
          >
            I knew this
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("FlashcardCard: Needs review clicked", card.id);
              onReview?.(card.id as unknown as string);
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
