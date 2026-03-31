"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Event = { id: string; date: string; name: string; sort_order: number; };

function parseYM(text: string): number {
  const normalized = text.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  const m = normalized.match(/(\d+)年(\d+)月/);
  if (!m) return 0;
  return parseInt(m[1]) * 100 + parseInt(m[2]);
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from("events").select("*").then(({ data }) => {
      const sorted = ((data as Event[]) ?? []).sort((a, b) => parseYM(a.date) - parseYM(b.date));
      setEvents(sorted);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">イベント</h1>
      <p className="text-gray-500 mb-10">チームで実施したイベントをご紹介します。</p>

      <div className="flex flex-col gap-4">
        {events.map((e) => (
          <div key={e.id} className="bg-white rounded-xl shadow p-5 flex gap-4">
            <div className="text-sm text-gray-400 w-36 flex-shrink-0 pt-0.5 whitespace-nowrap">{e.date}</div>
            <div>
              <p className="font-bold text-gray-800">{e.name}</p>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-center text-gray-400 py-6">読み込み中...</p>}
      </div>
    </div>
  );
}
