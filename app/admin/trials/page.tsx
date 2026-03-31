"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import SingleDatePicker from "@/components/SingleDatePicker";

type Trial = {
  id: string;
  date: string;
  start_time: string;
  location: string;
  meeting_point: string | null;
  items_to_bring: string | null;
  notes: string | null;
};

export default function AdminTrialsPage() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const locations = ["拝島第二小学校校庭", "エコパークグランド"];
  const timeOptions = Array.from({ length: 32 }, (_, i) => {
    const h = Math.floor(i / 2) + 6;
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2, "0")}:${m}`;
  });

  const [form, setForm] = useState({
    date: "",
    start_time: "",
    location: "",
    items_to_bring: "",
    notes: "",
  });

  useEffect(() => {
    fetchTrials();
  }, []);

  const fetchTrials = async () => {
    const { data } = await supabase
      .from("trials")
      .select("*")
      .order("date", { ascending: true });
    setTrials((data as Trial[]) || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.date || !form.start_time || !form.location) {
      setError("日付・開始時刻・場所は必須です");
      return;
    }
    setSaving(true);
    setError("");
    const { error: err } = await supabase.from("trials").insert({
      date: form.date,
      start_time: form.start_time,
      location: form.location,
      items_to_bring: form.items_to_bring || null,
      notes: form.notes || null,
    });
    if (err) {
      setError("保存に失敗しました: " + err.message);
    } else {
      setForm({ date: "", start_time: "", location: "", items_to_bring: "", notes: "" });
      await fetchTrials();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この体験会を削除しますか？")) return;
    await supabase.from("trials").delete().eq("id", id);
    await fetchTrials();
  };

  const handleDuplicate = (t: Trial) => {
    setForm({
      date: t.date,
      start_time: t.start_time,
      location: t.location,
      items_to_bring: t.items_to_bring || "",
      notes: t.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${days[date.getDay()]}）`;
  };

  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-blue-600 hover:underline text-sm">← 管理者トップ</Link>
        <h1 className="text-2xl font-bold text-gray-800">体験会管理</h1>
      </div>

      {/* 追加フォーム */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-700 mb-4">体験会を追加する</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">日付 <span className="text-red-500">*</span></label>
            <SingleDatePicker value={form.date} onChange={date => setForm({ ...form, date })} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">開始時刻 <span className="text-red-500">*</span></label>
            <select value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">選択してください</option>
              {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">場所 <span className="text-red-500">*</span></label>
            <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">選択してください</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">持ち物</label>
            <input type="text" value={form.items_to_bring} onChange={e => setForm({ ...form, items_to_bring: e.target.value })}
              placeholder="例：動きやすい服装、水筒"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">備考</label>
            <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="例：雨天中止"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <button onClick={handleAdd} disabled={saving}
          className="mt-4 bg-blue-600 text-white font-bold px-8 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50">
          {saving ? "保存中..." : "追加する"}
        </button>
      </div>

      {/* 一覧 */}
      <h2 className="text-lg font-bold text-gray-700 mb-3">登録済みの体験会（{trials.length}件）</h2>
      {loading ? (
        <p className="text-gray-400">読み込み中...</p>
      ) : trials.length === 0 ? (
        <p className="text-gray-400">まだ体験会が登録されていません</p>
      ) : (
        <div className="flex flex-col gap-3">
          {trials.map(t => (
            <div key={t.id} className="bg-white rounded-xl shadow p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-blue-700">{formatDate(t.date)} {formatTime(t.start_time)}〜</p>
                <p className="text-sm text-gray-700">📍 {t.location}</p>
                {t.meeting_point && <p className="text-sm text-gray-500">🚩 {t.meeting_point}</p>}
                {t.items_to_bring && <p className="text-sm text-gray-500">🎒 {t.items_to_bring}</p>}
                {t.notes && <p className="text-sm text-gray-500">📝 {t.notes}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleDuplicate(t)}
                  className="text-green-600 hover:text-green-800 text-sm font-bold whitespace-nowrap">
                  複写
                </button>
                <button onClick={() => handleDelete(t.id)}
                  className="text-red-400 hover:text-red-600 text-sm font-bold whitespace-nowrap">
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
