"use client";

import { useState } from "react";

type Props = {
  selectedDates: string[]; // YYYY-MM-DD 形式
  onChange: (dates: string[]) => void;
};

const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

// 日本の祝日（2026〜2027年）
const HOLIDAYS = new Set([
  "2026-03-20", // 春分の日
  "2026-04-29", // 昭和の日
  "2026-05-03", // 憲法記念日
  "2026-05-04", // みどりの日
  "2026-05-05", // こどもの日
  "2026-05-06", // 振替休日（憲法記念日）
  "2026-07-20", // 海の日
  "2026-08-11", // 山の日
  "2026-09-21", // 敬老の日
  "2026-09-22", // 国民の休日
  "2026-09-23", // 秋分の日
  "2026-10-12", // スポーツの日
  "2026-11-03", // 文化の日
  "2026-11-23", // 勤労感謝の日
  "2027-01-01", // 元日
  "2027-01-11", // 成人の日
  "2027-02-11", // 建国記念の日
  "2027-02-23", // 天皇誕生日
  "2027-03-21", // 春分の日
  "2027-04-29", // 昭和の日
  "2027-05-03", // 憲法記念日
  "2027-05-04", // みどりの日
  "2027-05-05", // こどもの日
  "2027-07-19", // 海の日
  "2027-08-11", // 山の日
  "2027-09-20", // 敬老の日
  "2027-09-23", // 秋分の日
  "2027-10-11", // スポーツの日
  "2027-11-03", // 文化の日
  "2027-11-23", // 勤労感謝の日
]);

function toJaLabel(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${DAYS[d.getDay()]}）`;
}

export default function MultiDatePicker({ selectedDates, onChange }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

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

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const toggle = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      onChange(selectedDates.filter(d => d !== dateStr));
    } else {
      onChange([...selectedDates, dateStr].sort());
    }
  };

  const remove = (dateStr: string) => {
    onChange(selectedDates.filter(d => d !== dateStr));
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mt-2">
      <p className="text-xs text-gray-500 mb-1">希望日をタップして選択してください（複数選択可）</p>
      <div className="flex gap-3 text-xs mb-3">
        <span className="text-red-400">日曜</span>
        <span className="text-blue-500">土曜</span>
        <span className="text-green-600">祝日</span>
        <span className="text-gray-300">平日・選択不可</span>
      </div>

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={prevMonth}
          className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-200 transition text-lg">
          ‹
        </button>
        <span className="font-bold text-gray-700 text-sm">{year}年{month + 1}月</span>
        <button type="button" onClick={nextMonth}
          className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-200 transition text-lg">
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
          const isSelected = selectedDates.includes(dateStr);
          const isToday = dateStr === todayStr;
          const dow = (firstDay + day - 1) % 7;
          const isPast = dateStr < todayStr;
          const isHoliday = HOLIDAYS.has(dateStr);
          const isSun = dow === 0;
          const isSat = dow === 6;
          // 平日（祝日・土日以外）は選択不可
          const isWeekday = !isSun && !isSat && !isHoliday;
          const isDisabled = isPast || isWeekday;

          return (
            <button
              type="button"
              key={i}
              onClick={() => !isDisabled && toggle(dateStr)}
              disabled={isDisabled}
              className={`flex items-center justify-center h-8 rounded-lg text-sm font-medium transition
                ${isPast ? "text-gray-300 cursor-not-allowed" :
                  isWeekday ? "text-gray-300 cursor-not-allowed" :
                  isSelected ? "bg-blue-600 text-white" :
                  isToday && !isDisabled ? "ring-2 ring-blue-400" :
                  ""}
                ${!isSelected && !isPast && !isWeekday ?
                  isHoliday ? "text-green-600 hover:bg-green-50" :
                  isSun ? "text-red-400 hover:bg-red-50" :
                  "text-blue-500 hover:bg-blue-50"
                  : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 選択済みタグ */}
      {selectedDates.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedDates.map(d => (
            <span key={d} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
              {toJaLabel(d)}
              <button type="button" onClick={() => remove(d)} className="text-blue-400 hover:text-blue-700 ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
