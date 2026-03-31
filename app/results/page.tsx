"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Tournament = { id: string; year_month: string; name: string; result: string; sort_order: number; };

function parseYM(text: string): number {
  const normalized = text.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  const m = normalized.match(/(\d+)年(\d+)月/);
  if (!m) return 0;
  return parseInt(m[1]) * 100 + parseInt(m[2]);
}

export default function ResultsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    supabase.from("tournaments").select("*").then(({ data }) => {
      const sorted = ((data as Tournament[]) ?? []).sort((a, b) => parseYM(a.year_month) - parseYM(b.year_month));
      setTournaments(sorted);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">大会実績</h1>
      <p className="text-gray-500 mb-10">チームのこれまでの大会成績をご紹介します。</p>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-left">年月</th>
              <th className="py-3 px-4 text-left">大会名</th>
              <th className="py-3 px-4 text-left">結果</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-500">{t.year_month}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{t.name}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.result === "優勝" ? "bg-yellow-100 text-yellow-700" :
                    t.result === "準優勝" ? "bg-gray-100 text-gray-600" :
                    "bg-blue-100 text-blue-700"
                  }`}>{t.result}</span>
                </td>
              </tr>
            ))}
            {tournaments.length === 0 && (
              <tr><td colSpan={3} className="py-6 text-center text-gray-400">読み込み中...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
