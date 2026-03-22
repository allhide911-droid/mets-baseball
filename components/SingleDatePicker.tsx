"use client";

import { useState } from "react";

type Props = {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
};

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

const HOLIDAYS = new Set([
  "2026-03-20", "2026-04-29", "2026-05-03", "2026-05-04", "2026-05-05", "2026-05-06",
  "2026-07-20", "2026-08-11", "2026-09-21", "2026-09-22", "2026-09-23", "2026-10-12",
  "2026-11-03", "2026-11-23",
  "2027-01-01", "2027-01-11", "2027-02-11", "2027-02-23", "2027-03-21",
  "2027-04-29", "2027-05-03", "2027-05-04", "2027-05-05",
  "2027-07-19", "2027-08-11", "2027-09-20", "2027-09-23", "2027-10-11",
  "2027-11-03", "2027-11-23",
]);

function toJaLabel(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DAYS[d.getDay()]}）`;
}

export default function SingleDatePicker({ value, onChange }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [open, setOpen] = useState(false);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const toDateStr = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="relative">
      {/* 表示ボタン */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      >
        {value ? toJaLabel(value) : "日付を選択してください"}
      </button>

      {/* カレンダーポップアップ */}
      {open && (
        <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={prevMonth}
              className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition text-lg">
              ‹
            </button>
            <span className="font-bold text-gray-700 text-sm">{year}年{month + 1}月</span>
            <button type="button" onClick={nextMonth}
              className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition text-lg">
              ›
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d, i) => (
              <div key={d} className={`text-center text-xs font-bold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"}`}>
                {d}
              </div>
            ))}
          </div>

          {/* グリッド */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = toDateStr(day);
              const isSelected = dateStr === value;
              const dow = (firstDay + day - 1) % 7;
              const isHoliday = HOLIDAYS.has(dateStr);

              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => { onChange(dateStr); setOpen(false); }}
                  className={`flex items-center justify-center h-8 rounded-lg text-sm font-medium transition
                    ${isSelected ? "bg-blue-600 text-white" :
                      isHoliday ? "text-green-600 hover:bg-green-50" :
                      dow === 0 ? "text-red-400 hover:bg-red-50" :
                      dow === 6 ? "text-blue-500 hover:bg-blue-50" :
                      "text-gray-700 hover:bg-gray-100"}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* 凡例 */}
          <div className="flex gap-3 text-xs text-gray-400 mt-2">
            <span className="text-red-400">日</span>
            <span className="text-blue-500">土</span>
            <span className="text-green-600">祝</span>
          </div>
        </div>
      )}
    </div>
  );
}
