"use client";

import { useState } from "react";

const steps = [
  {
    step: "1",
    title: "サイトで情報を確認する",
    desc: "チームの雰囲気・練習日程・費用・指導方針をチェックしましょう。",
    emoji: "📋",
    color: "bg-blue-50 border-blue-200",
    numColor: "bg-blue-600",
  },
  {
    step: "2",
    title: "体験申し込みボタンを押す",
    desc: "「体験を申し込む」ボタンからお子さんの名前・保護者のお名前・学年・体験日の入力もしくは体験開催日を選択して送信します。",
    emoji: "✏️",
    color: "bg-yellow-50 border-yellow-200",
    numColor: "bg-yellow-500",
  },
  {
    step: "3",
    title: "チャットでスタッフと連絡",
    desc: "体験に関する連絡・相談をメッツスタッフとチャットでやりとりできます。",
    emoji: "💬",
    color: "bg-green-50 border-green-200",
    numColor: "bg-green-600",
  },
];

export default function HowToUseModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ボタン */}
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-blue-100 underline underline-offset-2 text-sm hover:text-white transition"
      >
        このサイトの使い方を見る →
      </button>

      {/* モーダル */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* タイトル */}
            <h2 className="text-xl font-bold text-gray-800 mb-1">このサイトの使い方</h2>
            <p className="text-sm text-gray-500 mb-6">3ステップで体験申し込みができます</p>

            {/* ステップ */}
            <div className="flex flex-col gap-4">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className={`flex items-start gap-4 border rounded-xl p-4 ${s.color}`}
                >
                  {/* 番号 */}
                  <div
                    className={`${s.numColor} text-white font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    {s.step}
                  </div>
                  {/* テキスト */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{s.emoji}</span>
                      <span className="font-bold text-gray-800">{s.title}</span>
                    </div>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
