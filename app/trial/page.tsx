"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Trial = {
  id: string;
  date: string;
  start_time: string;
  location: string;
  meeting_point: string | null;
  items_to_bring: string | null;
  notes: string | null;
};

export default function TrialPage() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("trials")
        .select("*")
        .order("date", { ascending: true });
      setTrials((data as Trial[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${days[date.getDay()]}）`;
  };

  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">体験会日程</h1>
      <p className="text-gray-500 mb-10">
        体験入団はいつでも大歓迎！下記の日程からご参加ください。
      </p>

      {loading ? (
        <p className="text-gray-400">読み込み中...</p>
      ) : trials.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-blue-700 font-bold text-lg mb-1">日程調整中</p>
          <p className="text-gray-600 text-sm">近日公開予定です。体験希望日をフォームからお知らせください。</p>
          <Link href="/apply" className="inline-block mt-4 bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition text-sm">
            体験を申し込む
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {trials.map((trial) => (
            <div key={trial.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xl font-bold text-blue-700">{formatDate(trial.date)}</p>
                  <p className="text-gray-600 mt-1">開始時刻：{formatTime(trial.start_time)}</p>
                </div>
                <Link
                  href="/apply"
                  className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition text-sm text-center whitespace-nowrap"
                >
                  この日程で申し込む
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500 font-bold">📍 場所：</span>
                  <span className="text-gray-700">{trial.location}</span>
                </div>
                {trial.meeting_point && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-500 font-bold">🚩 集合場所：</span>
                    <span className="text-gray-700">{trial.meeting_point}</span>
                  </div>
                )}
                {trial.items_to_bring && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-500 font-bold">🎒 持ち物：</span>
                    <span className="text-gray-700">{trial.items_to_bring}</span>
                  </div>
                )}
                {trial.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-500 font-bold">📝 備考：</span>
                    <span className="text-gray-700">{trial.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-800">
        <p className="font-bold mb-1">⚠️ ご注意</p>
        <p>体験会は無料・申込不要でご参加いただけますが、事前にお申し込みいただくとよりスムーズにご案内できます。</p>
      </div>
    </div>
  );
}
