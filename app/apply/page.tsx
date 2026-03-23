"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MultiDatePicker from "@/components/MultiDatePicker";

const grades = ["年長", "小学1年", "小学2年", "小学3年", "小学4年", "小学5年", "小学6年"];

export default function ApplyPage() {
  const router = useRouter();
  const [trialDates, setTrialDates] = useState<string[]>([]);
  const [form, setForm] = useState({
    childName: "",
    childGrade: "",
    parentName: "",
    trialDate: "",
    trialDateCustom: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchTrials = async () => {
      const { data } = await supabase
        .from("trials")
        .select("date, start_time")
        .order("date", { ascending: true });
      if (data) {
        const days = ["日", "月", "火", "水", "木", "金", "土"];
        const dates = data.map((t: { date: string; start_time: string }) => {
          const d = new Date(t.date);
          const label = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）${t.start_time.slice(0, 5)}〜`;
          return label;
        });
        setTrialDates(dates);
      }
    };
    fetchTrials();
  }, []);

  const [customDates, setCustomDates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.trialDate === "その他" && customDates.length === 0) {
      setError("希望日をカレンダーから選択してください");
      return;
    }
    setIsSubmitting(true);
    setError("");

    const DAYS = ["日", "月", "火", "水", "木", "金", "土"];
    const toJaLabel = (s: string) => {
      const d = new Date(s);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DAYS[d.getDay()]}）`;
    };
    const trialDateValue = form.trialDate === "その他"
      ? customDates.length > 0
        ? customDates.map(toJaLabel).join("・")
        : form.trialDateCustom
      : form.trialDate;

    // クライアント側でIDを生成してから保存
    const newId = crypto.randomUUID();

    const { error: supabaseError } = await supabase
      .from("applicants")
      .insert({
        id: newId,
        child_name: form.childName,
        child_grade: form.childGrade,
        parent_name: form.parentName,
        trial_date: trialDateValue,
        message: form.message,
        status: "未確認",
      });

    if (supabaseError) {
      setError("送信中にエラーが発生しました。もう一度お試しください。");
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("mets_chat_id", newId);
    router.push(`/chat/${newId}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">体験申込</h1>
      <p className="text-gray-500 mb-8">
        下記フォームにご記入の上、「申し込む」ボタンを押してください。
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            お子さんのお名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="childName"
            value={form.childName}
            onChange={handleChange}
            required
            placeholder="例：田中 太郎"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            お子さんの学年 <span className="text-red-500">*</span>
          </label>
          <select
            name="childGrade"
            value={form.childGrade}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">選択してください</option>
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            保護者のお名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="parentName"
            value={form.parentName}
            onChange={handleChange}
            required
            placeholder="例：田中 一郎"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            体験希望日程 <span className="text-red-500">*</span>
          </label>
          <select
            name="trialDate"
            value={form.trialDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">選択してください</option>
            {trialDates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
            <option value="その他">その他（直接入力）</option>
          </select>
          {form.trialDate === "その他" && (
            <MultiDatePicker
              selectedDates={customDates}
              onChange={setCustomDates}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            メッセージ（任意）
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            placeholder="ご質問・ご要望などがあればお書きください"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition text-base disabled:opacity-50"
        >
          {isSubmitting ? "送信中..." : "申し込む"}
        </button>
      </form>
    </div>
  );
}
