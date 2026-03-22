"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Trial = {
  date: string;
  start_time: string;
  location: string;
  items_to_bring: string | null;
  notes: string | null;
};

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function NextTrial() {
  const [trial, setTrial] = useState<Trial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("trials")
        .select("date, start_time, location, items_to_bring, notes")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(1);
      setTrial(data?.[0] ?? null);
      setLoading(false);
    };
    fetch();
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${DAYS[date.getDay()]}）`;
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-gray-700 text-base mb-4">次回の体験会</h3>

        {loading ? (
          <p className="text-gray-400 text-sm">読み込み中...</p>
        ) : !trial ? (
          <div>
            <p className="text-blue-700 font-bold text-lg mb-1">日程調整中</p>
            <p className="text-gray-500 text-sm">近日公開予定です。お楽しみに！</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-blue-700 font-bold text-xl">{formatDate(trial.date)}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-gray-400 w-4">🕐</span>
                <span className="text-gray-700">{trial.start_time.slice(0, 5)}〜</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 w-4">📍</span>
                <span className="text-gray-700">{trial.location}</span>
              </div>
              {trial.items_to_bring && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 w-4">🎒</span>
                  <span className="text-gray-700">{trial.items_to_bring}</span>
                </div>
              )}
              {trial.notes && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 w-4">📝</span>
                  <span className="text-gray-700">{trial.notes}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <Link href="/apply"
          className="block w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-full text-center hover:bg-yellow-300 transition text-sm">
          体験を申し込む
        </Link>
        <Link href="/trial"
          className="block w-full text-center text-blue-600 text-xs hover:underline">
          体験会の日程をすべて見る →
        </Link>
      </div>
    </div>
  );
}
