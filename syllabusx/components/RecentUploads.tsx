"use client";

import React, { useEffect, useState } from "react";
import Button from "./Button";

interface RecentEntry {
  fileName: string;
  date: string;
  topics: number;
  cards: number;
}

interface RecentUploadsProps {
  refreshKey?: number;
}

const STORAGE_KEY = "syllabusx.recentUploads";

const RecentUploads: React.FC<RecentUploadsProps> = ({ refreshKey }) => {
  const [items, setItems] = useState<RecentEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as RecentEntry[]) : [];
      setItems(parsed.slice(0, 5));
    } catch (e) {
      setItems([]);
    }
  }, [refreshKey]);

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900">Recent uploads</h4>
        <Button variant="secondary" onClick={clearHistory} className="text-xs px-2 py-1">
          Clear history
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-700">No recent uploads</p>
      ) : (
        <ul className="space-y-2 text-sm text-slate-800">
          {items.map((it, idx) => (
            <li key={idx} className="flex justify-between items-start rounded-2xl bg-white border border-slate-100 p-3">
              <div>
                <div className="font-medium text-slate-900">{it.fileName}</div>
                <div className="text-xs text-slate-600">{new Date(it.date).toLocaleString()}</div>
              </div>
              <div className="text-xs text-slate-700">
                {it.topics} topic{it.topics !== 1 ? "s" : ""} • {it.cards} card{it.cards !== 1 ? "s" : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RecentUploads;
