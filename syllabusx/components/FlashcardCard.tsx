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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 flex flex-col">
      <div className="mb-3">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-base font-semibold text-slate-900 leading-7">{card.question}</h4>

          {card.status !== "unreviewed" ? (
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {card.status === "known" ? "Known" : "Needs review"}
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          <button
            type="button"
            aria-expanded={revealed}
            onClick={(e) => {
              e.stopPropagation();
              toggleReveal();
            }}
            className="text-sm text-blue-700 underline"
          >
            {revealed ? "Hide answer" : "Reveal answer"}
          </button>
        </div>
      </div>

      {revealed && (
        <div className="mt-4 flex flex-col">
          <div className="mb-4">
            <p className="text-sm leading-7 text-slate-700">{card.answer}</p>
          </div>

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
                  className="text-sm text-blue-700 underline"
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

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 sm:flex-row sm:justify-end">
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
      )}
    </div>
  );
};

export default FlashcardCard;
