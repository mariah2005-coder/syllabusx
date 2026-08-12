"use client";

import React from "react";
import type { Flashcard } from "../types/flashcard";

interface Topic {
  id: string;
  title: string;
  cards: Flashcard[];
}

export interface FocusListProps {
  topics: Topic[];
}

export default function FocusList({ topics }: FocusListProps) {
  const needsReviewTopics = topics.filter((t) => t.cards.some((c) => c.status === "needsReview"));

  return (
    <section className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Focus List</h3>
        <p className="mt-2 text-sm text-slate-700 max-w-2xl">Review the topics below if they have cards marked for follow-up.</p>
      </div>

      {needsReviewTopics.length === 0 ? (
        <p className="text-sm text-slate-700">No cards marked for review. You’re all set.</p>
      ) : (
        <ul className="space-y-2 text-sm text-slate-800">
          {needsReviewTopics.map((t) => (
            <li key={t.id} className="rounded-2xl bg-white border border-slate-100 p-3 shadow-sm">
              {t.title} — {t.cards.filter((c) => c.status === "needsReview").length} card(s)
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
