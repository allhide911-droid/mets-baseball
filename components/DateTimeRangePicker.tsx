"use client";

import { useState, useEffect } from "react";

const DAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

function generateTimes() {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    times.push(`${h}:00`);
    times.push(`${h}:30`);
  }
  return times;
}

const TIMES = generateTimes();

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function DateTimeRangePicker({ value, onChange }: Props) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("9:00");
  const [endTime, setEndTime] = useState("12:00");

  // 初期値を文字列からパース（保存済みデータの復元用）
  useEffect(() => {
    if (!value) return;
    // 例: "2026年4月6日（日）9:00〜12:00" からパースを試みる
    const match = value.match(/(\d{4})年(\d{1,2})月(\d{1,2})日[^）]*）\s*([0-9:]+)〜([0-9:]+)/);
    if (match) {
      const y = match[1], m = match[2].padStart(2, "0"), d = match[3].padStart(2, "0");
      setDate(`${y}-${m}-${d}`);
      setStartTime(match[4]);
      setEndTime(match[5]);
    }
  }, []);

  const format = (d: string, s: string, e: string) => {
    if (!d) return "";
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = dt.getMonth() + 1;
    const day = dt.getDate();
    const dow = DAYS_JA[dt.getDay()];
    return `${y}年${m}月${day}日（${dow}）${s}〜${e}`;
  };

  const handleChange = (newDate: string, newStart: string, newEnd: string) => {
    onChange(format(newDate, newStart, newEnd));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 日付 */}
      <div>
        <label className="text-xs text-gray-500 block mb-1">日付</label>
        <input
          type="date"
          value={date}
          onChange={e => { setDate(e.target.value); handleChange(e.target.value, startTime, endTime); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 時間帯 */}
      <div className="flex items-center gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">開始時間</label>
          <select
            value={startTime}
            onChange={e => { setStartTime(e.target.value); handleChange(date, e.target.value, endTime); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <span className="text-gray-500 mt-4">〜</span>
        <div>
          <label className="text-xs text-gray-500 block mb-1">終了時間</label>
          <select
            value={endTime}
            onChange={e => { setEndTime(e.target.value); handleChange(date, startTime, e.target.value); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* プレビュー */}
      {date && (
        <p className="text-sm text-blue-700 font-bold bg-blue-50 px-3 py-2 rounded-lg">
          {format(date, startTime, endTime)}
        </p>
      )}
    </div>
  );
}
