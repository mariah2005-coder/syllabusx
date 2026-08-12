"use client";

import React, { useReducer, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import UploadPanel from "../components/UploadPanel";
import ProgressBanner from "../components/ProgressBanner";
import TopicChunkCard from "../components/TopicChunkCard";
import FocusList from "../components/FocusList";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import RecentUploads from "../components/RecentUploads";

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
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [generationRetryable, setGenerationRetryable] = useState(false);

  const [state, dispatch] = useReducer(reducer, { topics: [] });
  const [recentKey, setRecentKey] = useState(0);

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
      setExtractedText(text);

      setUiState("generating");
      setMessage("Generating flashcards — this may take a moment.");

      const genRes = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!genRes.ok) {
        const e = await genRes.json().catch(() => ({}));
        if (e?.retryable) {
          setGenerationRetryable(true);
          throw new Error(e?.error || "Our AI service is briefly busy — please try again in a moment.");
        }

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
              detail: typeof f.detail === "string" && f.detail.trim() ? String(f.detail) : undefined,
              status: "unreviewed" as CardStatus,
            }))
          : [],
      }));

      dispatch({ type: "setTopics", topics });
      setUiState("ready");
      setMessage(undefined);

      try {
        const totalTopics = topics.length;
        const totalCards = topics.reduce((s, t) => s + (t.cards?.length || 0), 0);
        const entry = { fileName: file.name, date: new Date().toISOString(), topics: totalTopics, cards: totalCards };
        const raw = localStorage.getItem("syllabusx.recentUploads");
        const arr = raw ? JSON.parse(raw) : [];
        arr.unshift(entry);
        if (arr.length > 5) arr.length = 5;
        localStorage.setItem("syllabusx.recentUploads", JSON.stringify(arr));
        setRecentKey((k) => k + 1);
      } catch (e) {
        console.log("Could not save recent upload", e);
      }
    } catch (err: any) {
        setError(err?.message || "An unexpected error occurred.");
        setUiState("error");
        setMessage(undefined);
    }
  }

    async function retryGeneration() {
      if (!extractedText) return;

      setGenerationRetryable(false);
      setError(undefined);
      setUiState("generating");
      setMessage("Generating flashcards — this may take a moment.");

      try {
        const genRes = await fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: extractedText }),
        });

        if (!genRes.ok) {
          const e = await genRes.json().catch(() => ({}));
          if (e?.retryable) {
            setGenerationRetryable(true);
            throw new Error(e?.error || "Our AI service is briefly busy — please try again in a moment.");
          }
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
                detail: typeof f.detail === "string" && f.detail.trim() ? String(f.detail) : undefined,
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
    console.log("page.tsx: handleKnown", id);
    dispatch({ type: "markKnown", cardId: id });
  }

  function handleReview(id: string) {
    console.log("page.tsx: handleReview", id);
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

      <div className="space-y-8">
        {uiState === "uploading" || uiState === "generating" ? (
          <ProgressBanner title={uiState === "uploading" ? "Uploading PDF" : "Generating flashcards"} message={message} />
        ) : null}

        {uiState === "idle" ? (
          <div className="space-y-4">
            <RecentUploads refreshKey={recentKey} />
            <UploadPanel onFileSelected={handleFile} />
          </div>
        ) : null}

        {uiState === "error" ? (
          <div className="space-y-4 rounded-3xl border border-rose-100 bg-rose-50/70 p-5">
            <p className="text-sm font-semibold text-rose-900">Something went wrong</p>
            <p className="text-sm text-rose-800">{error}</p>
            <div className="flex justify-start">
              {generationRetryable ? (
                <>
                  <Button variant="primary" onClick={retryGeneration}>Try Again</Button>
                  <div className="ml-3">
                    <Button variant="ghost" onClick={handleStartOver}>Start Over</Button>
                  </div>
                </>
              ) : (
                <Button variant="primary" onClick={handleStartOver}>Start Over</Button>
              )}
            </div>
          </div>
        ) : null}

        {uiState === "ready" && state.topics.length === 0 ? (
          <EmptyState title="No flashcards generated" description="The document didn’t produce flashcards. Try a different syllabus file." />
        ) : null}

        {uiState === "ready" && state.topics.length > 0 ? (
          <div className="space-y-8">
            {state.topics.map((topic) => (
              <TopicChunkCard key={topic.id} title={topic.title} cards={topic.cards} onKnown={handleKnown} onReview={handleReview} />
            ))}

            {/* Focus list moved to its own component for testability */}
            <FocusList topics={state.topics} />

            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleStartOver}>Start Over</Button>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
