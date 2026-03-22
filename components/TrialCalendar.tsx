"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Trial = {
  date: string; // YYYY-MM-DD
  start_time: string;
  location: string;
};

type Applicant = {
  trial_date: string; // text形式
};

// 日本の祝日（2026〜2027年）
const HOLIDAYS = new Set([
  "2026-03-20", "2026-04-29", "2026-05-03", "2026-05-04", "2026-05-05", "2026-05-06",
  "2026-07-20", "2026-08-11", "2026-09-21", "2026-09-22", "2026-09-23", "2026-10-12",
  "2026-11-03", "2026-11-23",
  "2027-01-01", "2027-01-11", "2027-02-11", "2027-02-23", "2027-03-21",
  "2027-04-29", "2027-05-03", "2027-05-04", "2027-05-05",
  "2027-07-19", "2027-08-11", "2027-09-20", "2027-09-23", "2027-10-11",
  "2027-11-03", "2027-11-23",
]);

// "2026年4月5日（日）09:00〜" のような文字列から "2026-04-05" を抽出
function parseJaDate(text: string): string | null {
  const m = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!m) return null;
  return `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;
}

export default function TrialCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [trials, setTrials] = useState<Trial[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data: trialData } = await supabase.from("trials").select("date, start_time, location");
      const { data: appData } = await supabase.from("applicants").select("trial_date");
      setTrials((trialData as Trial[]) || []);
      setApplicants((appData as Applicant[]) || []);
    };
    fetch();
  }, []);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  // このカレンダー月のトライアル日セット
  const trialDates = new Set(trials.map(t => t.date));
  // 申込日セット（複数日付対応・「・」区切りで分割してパース）
  const applicantDates = new Set(
    applicants.flatMap(a =>
      a.trial_date.split("・").map(parseJaDate).filter(Boolean) as string[]
    )
  );

  // カレンダーグリッド生成
  const firstDay = new Date(year, month, 1).getDay(); // 0=日
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const toDateStr = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // 選択日の詳細
  const selectedTrials = selectedDay ? trials.filter(t => t.date === selectedDay) : [];
  const selectedApplicantCount = selectedDay
    ? applicants.filter(a =>
        a.trial_date.split("・").some(d => parseJaDate(d) === selectedDay)
      ).length
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition text-lg">
          ‹
        </button>
        <h3 className="font-bold text-gray-800 text-lg">{year}年{month + 1}月</h3>
        <button onClick={nextMonth} className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition text-lg">
          ›
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div key={d} className={`text-center text-xs font-bold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"}`}>
            {d}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = toDateStr(day);
          const hasTrial = trialDates.has(dateStr);
          const hasApplicant = applicantDates.has(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDay;
          const dow = (firstDay + day - 1) % 7;
          const isHoliday = HOLIDAYS.has(dateStr);

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(isSelected ? null : dateStr)}
              className={`relative flex flex-col items-center py-1.5 rounded-lg transition
                ${isSelected ? "bg-blue-100 ring-2 ring-blue-400" : "hover:bg-gray-50"}
              `}
            >
              <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                ${isToday ? "bg-blue-600 text-white" : isHoliday ? "text-green-600" : dow === 0 ? "text-red-400" : dow === 6 ? "text-blue-500" : "text-gray-700"}
              `}>
                {day}
              </span>
              {/* ドット */}
              <div className="flex gap-0.5 mt-0.5 h-2 items-center">
                {hasTrial && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                {hasApplicant && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />体験会</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />体験希望申込</span>
      </div>

      {/* 選択日の詳細 */}
      {selectedDay && (selectedTrials.length > 0 || selectedApplicantCount > 0) && (
        <div className="mt-4 border-t pt-3 space-y-2">
          {selectedTrials.map((t, i) => (
            <div key={i} className="bg-blue-50 rounded-lg p-3 text-sm">
              <p className="font-bold text-blue-700">⚾ 体験会</p>
              <p className="text-gray-700">{t.start_time.slice(0, 5)}〜 / {t.location}</p>
            </div>
          ))}
          {selectedApplicantCount > 0 && (
            <div className="bg-orange-50 rounded-lg p-3 text-sm">
              <p className="font-bold text-orange-600">📋 体験希望申込</p>
              <p className="text-gray-700">{selectedApplicantCount}件の申込があります</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 text-center">
        <Link href="/apply" className="text-blue-600 text-sm hover:underline">体験を申し込む →</Link>
      </div>
    </div>
  );
}
