"use client";

import FlyerBase, { FlyerData } from "@/components/FlyerBase";
import { QRCodeSVG } from "qrcode.react";

const APPLY_URL = "https://mets-baseball.vercel.app/apply";

const fields = [
  { key: "teamName", label: "チーム名", placeholder: "例：昭島美堀メッツ", defaultValue: "昭島美堀メッツ" },
  { key: "target", label: "対象", placeholder: "例：小学生・年長さん・初心者・女の子大歓迎", defaultValue: "小学生・年長さん・初心者・女の子大歓迎！" },
  { key: "schedule", label: "活動日時", placeholder: "例：毎週日曜日 9:00〜12:00" },
  { key: "location", label: "活動場所", placeholder: "例：昭島市美堀町グラウンド" },
  { key: "fee", label: "月会費など費用", placeholder: "例：月2,000円（ユニフォーム代別途）" },
  { key: "notes", label: "備考", placeholder: "例：まずは体験から！お気軽にご参加ください。", multiline: true },
];

function Preview(data: FlyerData, _font: string, _fontSize: string, imageData: string | null, imageType: string | null) {
  return (
    <div className="flyer-preview bg-white rounded-xl shadow-lg p-8 print:shadow-none print:rounded-none print:p-6" style={{ fontFamily: font }}>
      <div className="text-center mb-6">
        <div className="inline-block bg-blue-700 text-white text-3xl font-black px-6 py-2 rounded-full mb-3">
          ⚾ メンバー募集中！
        </div>
        <h1 className="text-2xl font-black text-gray-800 mt-2">{data.teamName || "昭島美堀メッツ"} 少年野球チーム</h1>
        <p className="text-lg font-black text-red-500 mt-2">{data.target}</p>
      </div>

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
            {data.schedule && (
              <tr className="border-b border-blue-100">
                <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap w-28">📅 活動日時</td>
                <td className="py-3 font-bold text-gray-800 text-base">{data.schedule}</td>
              </tr>
            )}
            {data.location && (
              <tr className="border-b border-blue-100">
                <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap">📍 活動場所</td>
                <td className="py-3 font-bold text-gray-800 text-base">{data.location}</td>
              </tr>
            )}
            {data.fee && (
              <tr className={data.notes ? "border-b border-blue-100" : ""}>
                <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap">💴 費用</td>
                <td className="py-3 text-gray-700">{data.fee}</td>
              </tr>
            )}
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
          <p className="font-black text-gray-800 text-base mb-2">📱 まずは体験から！</p>
          <p>・QRコードから体験申込ができます</p>
          <p>・スタッフとチャットで気軽に質問OK</p>
          <p>・申込後もいつでもやりとり可能</p>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-gray-400">
        昭島美堀メッツ少年野球チーム｜{APPLY_URL}
      </div>
    </div>
  );
}

export default function RecruitFlyerPage() {
  return (
    <FlyerBase
      storageKey="mets_recruit_flyers"
      title="メンバー募集チラシ作成"
      fields={fields}
      renderPreview={Preview}
    />
  );
}
