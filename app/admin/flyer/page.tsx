"use client";

import FlyerBase, { FlyerData, FontSizes, Alignments } from "@/components/FlyerBase";
import { QRCodeSVG } from "qrcode.react";

const APPLY_URL = "https://mets-baseball.vercel.app/apply";

const fields = [
  { key: "date", label: "日時 *", placeholder: "", datetimerange: true },
  { key: "location", label: "場所 *", placeholder: "例：昭島市美堀町グラウンド" },
  { key: "items", label: "用意するもの", placeholder: "例：動きやすい服装・運動靴・水筒", defaultValue: "動きやすい服装・運動靴・水筒" },
  { key: "notes", label: "備考", placeholder: "例：雨天中止の場合は前日にご連絡します", multiline: true },
  { key: "noReservation", label: "申込不要表示", placeholder: "「申込不要・当日参加OK！」を表示する", checkbox: true },
];

const fs = (sizes: FontSizes, key: string, def = "1rem") => sizes[key] ?? def;
const fa = (aligns: Alignments, key: string, def = "left") => aligns[key] ?? def;

function Preview(data: FlyerData, _font: string, fontSizes: FontSizes, alignments: Alignments, imageData: string | null, imageType: string | null) {
  return (
    <div className="flyer-preview bg-white rounded-xl shadow-lg p-8 print:shadow-none print:rounded-none print:p-6">
      <div className="mb-6" style={{ textAlign: fa(alignments, "title", "center") as "left"|"center"|"right" }}>
        <div style={{ display: "inline-block", width: "33.33%" }}>
          <h1 className="font-black text-gray-800" style={{ fontSize: fs(fontSizes, "title", "1.7rem") }}>昭島美堀メッツ<br />野球体験会</h1>
        </div>
        <p className="text-gray-500 mt-2" style={{ fontSize: fs(fontSizes, "subtitle", "0.9rem") }}>小学生はぜひ！初心者・女の子も大歓迎！</p>
      </div>

      {data.noReservation === "true" && (
        <div className="text-center mb-6">
          <span className="inline-block bg-red-500 text-white font-black px-6 py-2 rounded-full" style={{ fontSize: fs(fontSizes, "noReservation", "1.2rem") }}>
            申込不要・当日参加OK！
          </span>
        </div>
      )}

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
        <table className="w-full">
          <tbody>
            <tr className="border-b border-blue-100">
              <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap w-28 text-sm">📅 日時</td>
              <td className="py-3 font-bold text-gray-800" style={{ fontSize: fs(fontSizes, "date"), textAlign: fa(alignments, "date") as "left"|"center"|"right" }}>{data.date || "（日時を入力してください）"}</td>
            </tr>
            <tr className="border-b border-blue-100">
              <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap text-sm">📍 場所</td>
              <td className="py-3 font-bold text-gray-800" style={{ fontSize: fs(fontSizes, "location"), textAlign: fa(alignments, "location") as "left"|"center"|"right" }}>{data.location || "（場所を入力してください）"}</td>
            </tr>
            <tr className={data.notes ? "border-b border-blue-100" : ""}>
              <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap text-sm">🎒 持ち物</td>
              <td className="py-3 text-gray-700" style={{ fontSize: fs(fontSizes, "items"), textAlign: fa(alignments, "items") as "left"|"center"|"right" }}>{data.items}</td>
            </tr>
            {data.notes && (
              <tr>
                <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap text-sm">📝 備考</td>
                <td className="py-3 text-gray-700" style={{ fontSize: fs(fontSizes, "notes"), textAlign: fa(alignments, "notes") as "left"|"center"|"right" }}>{data.notes}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center justify-center bg-gray-50 rounded-xl p-6">
        <div className="text-center">
          <QRCodeSVG value={APPLY_URL} size={80} />
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
