"use client";

import Image from "next/image";
import React, { useReducer, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import UploadPanel from "../components/UploadPanel";
import ProgressBanner from "../components/ProgressBanner";
import TopicChunkCard from "../components/TopicChunkCard";
import FlashcardGrid from "../components/FlashcardGrid";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

type CardStatus = "unreviewed" | "known" | "needsReview";

interface Card {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  status: CardStatus;
}

interface Topic {
  id: string;
  title: string;
  cards: Card[];
}

type State = {
  topics: Topic[];
};

type Action =
  | { type: "setTopics"; topics: Topic[] }
  | { type: "markKnown"; cardId: string }
  | { type: "markReview"; cardId: string }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setTopics":
      return { topics: action.topics };
    case "markKnown":
      return {
        topics: state.topics.map((t) => ({
          ...t,
          cards: t.cards.map((c) => (c.id === action.cardId ? { ...c, status: "known" } : c)),
        })),
      };
    case "markReview":
      return {
        topics: state.topics.map((t) => ({
          ...t,
          cards: t.cards.map((c) => (c.id === action.cardId ? { ...c, status: "needsReview" } : c)),
        })),
      };
    case "reset":
      return { topics: [] };
    default:
      return state;
  }
}

export default function Home() {
  const [uiState, setUiState] = useState<"idle" | "uploading" | "generating" | "ready" | "error">("idle");
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const [state, dispatch] = useReducer(reducer, { topics: [] });

  async function handleFile(file: File) {
    setError(undefined);
    setMessage("Uploading and extracting text...");
    setUiState("uploading");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) {
        const e = await uploadRes.json().catch(() => ({}));
        throw new Error(e?.error || "Upload failed");
      }

      const uploadData = await uploadRes.json();
      const text: string = uploadData?.text || "";

      setUiState("generating");
      setMessage("Generating flashcards — this may take a moment.");

      const genRes = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!genRes.ok) {
        const e = await genRes.json().catch(() => ({}));
        throw new Error(e?.error || "Generation failed");
      }

      const genData = await genRes.json();
      const topicsSource = Array.isArray(genData?.topics) ? genData.topics : [];

      const topics: Topic[] = topicsSource.map((t: any, ti: number) => ({
        id: `topic-${ti}`,
        title: typeof t.title === "string" ? t.title : `Topic ${ti + 1}`,
        cards: Array.isArray(t.flashcards)
          ? t.flashcards.map((f: any, fi: number) => ({
              id: `card-${ti}-${fi}`,
              topicId: `topic-${ti}`,
              question: String(f.question || ""),
              answer: String(f.answer || ""),
              status: "unreviewed" as CardStatus,
            }))
          : [],
      }));

      dispatch({ type: "setTopics", topics });
      setUiState("ready");
      setMessage(undefined);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setUiState("error");
      setMessage(undefined);
    }
  }

  function handleKnown(id: string) {
    dispatch({ type: "markKnown", cardId: id });
  }

  function handleReview(id: string) {
    dispatch({ type: "markReview", cardId: id });
  }

  function handleStartOver() {
    dispatch({ type: "reset" });
    setUiState("idle");
    setMessage(undefined);
    setError(undefined);
  }

  const needsReviewTopics = state.topics.filter((t) => t.cards.some((c) => c.status === "needsReview"));

  return (
    <AppShell>
      <PageHeader />

      <div className="space-y-6">
        {uiState === "uploading" || uiState === "generating" ? (
          <ProgressBanner title={uiState === "uploading" ? "Uploading PDF" : "Generating flashcards"} message={message} />
        ) : null}

        {uiState === "idle" ? (
          <UploadPanel onFileSelected={handleFile} />
        ) : null}

        {uiState === "error" ? (
          <div className="space-y-3">
            <div className="text-sm text-red-600">{error}</div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleStartOver}>Start Over</Button>
            </div>
          </div>
        ) : null}

        {uiState === "ready" && state.topics.length === 0 ? (
          <EmptyState title="No flashcards generated" description="The document didn't produce flashcards. Try a different file." />
        ) : null}

        {uiState === "ready" && state.topics.length > 0 ? (
          <div className="space-y-6">
            {state.topics.map((topic) => (
              <TopicChunkCard key={topic.id} title={topic.title} cards={topic.cards} onKnown={handleKnown} onReview={handleReview} />
            ))}

            <section className="bg-white border border-gray-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Focus List</h3>
              {needsReviewTopics.length === 0 ? (
                <p className="text-sm text-gray-600">No cards marked for review. You're all set!</p>
              ) : (
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {needsReviewTopics.map((t) => (
                    <li key={t.id}>{t.title} ({t.cards.filter(c => c.status === 'needsReview').length} cards)</li>
                  ))}
                </ul>
              )}
            </section>

            <div className="flex justify-end">
              <Button variant="ghost" onClick={handleStartOver}>Start Over</Button>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
