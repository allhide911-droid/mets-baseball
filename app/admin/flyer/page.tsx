"use client";

import FlyerBase, { FlyerData } from "@/components/FlyerBase";
import { QRCodeSVG } from "qrcode.react";

const APPLY_URL = "https://mets-baseball.vercel.app/apply";

const fields = [
  { key: "date", label: "日時 *", placeholder: "例：2026年4月6日（日）9:00〜12:00" },
  { key: "location", label: "場所 *", placeholder: "例：昭島市美堀町グラウンド" },
  { key: "items", label: "用意するもの", placeholder: "例：動きやすい服装・運動靴・水筒", defaultValue: "動きやすい服装・運動靴・水筒" },
  { key: "notes", label: "備考", placeholder: "例：雨天中止の場合は前日にご連絡します", multiline: true },
  { key: "noReservation", label: "申込不要表示", placeholder: "「申込不要・当日参加OK！」を表示する", checkbox: true },
];

function Preview(data: FlyerData, font: string, imageData: string | null, imageType: string | null) {
  return (
    <div className="flyer-preview bg-white rounded-xl shadow-lg p-8 print:shadow-none print:rounded-none print:p-6" style={{ fontFamily: font }}>
      <div className="text-center mb-6">
        <div className="inline-block bg-blue-700 text-white text-3xl font-black px-6 py-2 rounded-full mb-3">
          ⚾ 体験会のお知らせ
        </div>
        <h1 className="text-2xl font-black text-gray-800 mt-2">昭島美堀メッツ 少年野球チーム</h1>
        <p className="text-gray-500 text-sm mt-1">小学生・年長さん・初心者・女の子も大歓迎！</p>
      </div>

      {data.noReservation === "true" && (
        <div className="text-center mb-6">
          <span className="inline-block bg-red-500 text-white text-xl font-black px-6 py-2 rounded-full">
            申込不要・当日参加OK！
          </span>
        </div>
      )}

      {/* 追加画像・PDF */}
      {imageData && (
        <div className="mb-6 flex justify-center">
          {imageType?.startsWith("image/") ? (
            <img src={imageData} alt="チラシ画像" className="max-h-48 rounded-xl object-contain border" />
          ) : (
            <embed src={imageData} type="application/pdf" className="w-full h-64 rounded-xl border" />
          )}
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-blue-100">
              <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap w-28">📅 日時</td>
              <td className="py-3 font-bold text-gray-800 text-base">{data.date || "（日時を入力してください）"}</td>
            </tr>
            <tr className="border-b border-blue-100">
              <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap">📍 場所</td>
              <td className="py-3 font-bold text-gray-800 text-base">{data.location || "（場所を入力してください）"}</td>
            </tr>
            <tr className={data.notes ? "border-b border-blue-100" : ""}>
              <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap">🎒 持ち物</td>
              <td className="py-3 text-gray-700">{data.items}</td>
            </tr>
            {data.notes && (
              <tr>
                <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap">📝 備考</td>
                <td className="py-3 text-gray-700">{data.notes}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center justify-center bg-gray-50 rounded-xl p-6">
        <div className="text-center">
          <QRCodeSVG value={APPLY_URL} size={120} />
          <p className="text-xs font-bold text-gray-600 mt-2">体験申込はこちら</p>
          <p className="text-xs text-gray-400">{APPLY_URL}</p>
        </div>
        <div className="text-sm text-gray-600 text-center sm:text-left">
          <p className="font-black text-gray-800 text-base mb-2">📱 QRコードから申込・お問い合わせができます</p>
          <p>・体験申込フォームに入力</p>
          <p>・スタッフとチャットでやりとり可能</p>
          <p>・申込後もいつでも質問OK</p>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-gray-400">
        昭島美堀メッツ少年野球チーム｜{APPLY_URL}
      </div>
    </div>
  );
}

export default function FlyerPage() {
  return (
    <FlyerBase
      storageKey="mets_trial_flyers"
      title="体験会チラシ作成"
      fields={fields}
      renderPreview={Preview}
    />
  );
}
