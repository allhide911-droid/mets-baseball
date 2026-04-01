"use client";

import FlyerBase, { FlyerData, FontSizes, Alignments } from "@/components/FlyerBase";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabase";
import teamConfig from "@/lib/team-config";

const APPLY_URL = `${teamConfig.siteUrl}/apply`;

const fields = [
  { key: "date", label: "日時① *", placeholder: "", datetimerange: true },
  { key: "date2", label: "日時②", placeholder: "", datetimerange: true },
  { key: "location", label: "場所 *", placeholder: "例：昭島市美堀町グラウンド" },
  { key: "items", label: "用意するもの", placeholder: "例：動きやすい服装・運動靴・水筒", defaultValue: "動きやすい服装・運動靴・水筒" },
  { key: "notes", label: "備考", placeholder: "例：雨天中止の場合は前日にご連絡します", multiline: true },
  { key: "comment", label: "タイトル下コメント", placeholder: "例：保護者同伴でお願いします。雨天中止の場合は前日連絡します。", multiline: true },
  { key: "noReservation", label: "申込不要表示", placeholder: "「申込不要・当日参加OK！」を表示する", checkbox: true },
  { key: "showQR", label: "QRコード表示", placeholder: "QRコードを表示する", checkbox: true, defaultValue: "true" },
];

const fs = (sizes: FontSizes, key: string, def = "1rem") => sizes[key] ?? def;
const fa = (aligns: Alignments, key: string, def = "left") => aligns[key] ?? def;

function Preview(data: FlyerData, _font: string, fontSizes: FontSizes, alignments: Alignments, imageData: string | null, imageType: string | null) {
  return (
    <div className="flyer-preview bg-white rounded-xl shadow-lg p-8 print:shadow-none print:rounded-none print:p-2">
      <div className="mb-4" style={{ textAlign: fa(alignments, "title", "left") as "left"|"center"|"right" }}>
        <h1 className="font-black text-gray-800 leading-none" style={{ fontSize: "clamp(3.5rem, 14vw, 7rem)" }}>{teamConfig.teamShortName}<br />{teamConfig.sport}体験会</h1>
        <p className="font-black text-gray-600 mt-2" style={{ fontSize: "1.3rem" }}>小学生大募集⚾初心者も、女の子も大歓迎✨✨</p>
        {data.comment && (
          <p className="text-gray-700 mt-2 whitespace-pre-wrap" style={{ fontSize: "1rem" }}>{data.comment}</p>
        )}
      </div>

      <style>{`@media print { .flyer-table td { padding-top: 4px !important; padding-bottom: 4px !important; } .flyer-table-wrap { padding: 8px !important; margin-bottom: 8px !important; } .flyer-preview { max-height: 285mm !important; overflow: hidden !important; page-break-before: avoid !important; page-break-after: avoid !important; page-break-inside: avoid !important; break-before: avoid !important; break-after: avoid !important; break-inside: avoid !important; } }`}</style>
      <div className="flyer-table-wrap bg-blue-50 rounded-xl p-6 mb-6">
        <table className="flyer-table w-full">
          <tbody>
            <tr className="border-b border-blue-100">
              <td className="py-3 pr-4 font-black text-blue-800 whitespace-nowrap w-28 text-sm">📅 日時</td>
              <td className="py-3 font-bold text-gray-800" style={{ fontSize: fs(fontSizes, "date"), textAlign: fa(alignments, "date") as "left"|"center"|"right" }}>
                {data.date ? (() => {
                  const m = data.date.match(/^(.+?)\s*(\d{1,2}:\d{2}〜\d{1,2}:\d{2})$/);
                  return m ? <>①&nbsp;{m[1]}&nbsp;{m[2]}</> : <>①&nbsp;{data.date}</>;
                })() : "（日時①を入力してください）"}
                {data.date2 && (() => {
                  const m = data.date2.match(/^(.+?)\s*(\d{1,2}:\d{2}〜\d{1,2}:\d{2})$/);
                  return <><br />②&nbsp;{m ? <>{m[1]}&nbsp;{m[2]}</> : data.date2}</>;
                })()}
              </td>
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

      {/* 画像＋オーバーレイ */}
      {imageData && (
        <div className="relative rounded-xl overflow-hidden mb-4">
          {imageType?.startsWith("image/") ? (
            <img src={imageData} alt="チラシ画像" className="w-full" style={{ maxHeight: "36rem", objectFit: "contain", filter: "brightness(1.15) contrast(1.05)" }} />
          ) : (
            <embed src={imageData} type="application/pdf" className="w-full" style={{ height: "36rem" }} />
          )}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-between px-6">
            <div>
              {data.noReservation === "true" && (
                <span className="inline-block bg-red-500 text-white font-black px-5 py-3 rounded-full text-center text-2xl">
                  申込不要<br />当日参加OK！
                </span>
              )}
            </div>
            {data.showQR !== "false" && (
              <div className="absolute bottom-4 right-6 flex flex-col items-center text-center">
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG value={APPLY_URL} size={140} />
                </div>
                <p className="text-white font-black text-base mt-2">📱 QRコードから申込・<br />お問い合わせもできます</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 画像なしの場合 */}
      {!imageData && (
        <div className="flex gap-4 items-center justify-between bg-gray-50 rounded-xl p-4">
          <div className="flex-1 flex items-center justify-center">
            {data.noReservation === "true" && (
              <span className="inline-block bg-red-500 text-white font-black px-4 py-2 rounded-full text-center text-lg">
                申込不要<br />当日参加OK！
              </span>
            )}
          </div>
          {data.showQR !== "false" && (
            <div className="flex-1 flex flex-col items-center text-center">
              <QRCodeSVG value={APPLY_URL} size={80} />
              <p className="text-xs text-gray-400 mt-1">{APPLY_URL}</p>
              <p className="font-black text-gray-800 text-sm mt-2">📱 QRコードから申込・<br />お問い合わせもできます</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-6 text-xs text-gray-400">
        {teamConfig.teamName}｜{APPLY_URL}
      </div>
    </div>
  );
}

function parseFlyerDate(dateStr: string) {
  const m = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日.*?(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const [, year, month, day, hour, min] = m;
  return {
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    start_time: `${String(hour).padStart(2, "0")}:${min}`,
  };
}

export default function FlyerPage() {
  const handleReflect = async (data: FlyerData) => {
    if (!data.location) return { ok: false, message: "❌ 場所を入力してください" };

    const dates = [data.date, data.date2].filter(Boolean) as string[];
    if (dates.length === 0) return { ok: false, message: "❌ 日時を入力してください" };

    let added = 0;
    let skipped = 0;

    for (const dateStr of dates) {
      const parsed = parseFlyerDate(dateStr);
      if (!parsed) { skipped++; continue; }

      const { data: existing } = await supabase
        .from("trials")
        .select("id")
        .eq("date", parsed.date)
        .eq("start_time", parsed.start_time)
        .eq("location", data.location);

      if (existing && existing.length > 0) { skipped++; continue; }

      const { error } = await supabase.from("trials").insert({
        date: parsed.date,
        start_time: parsed.start_time,
        location: data.location,
        items_to_bring: data.items || null,
        notes: data.notes || null,
      });
      if (error) return { ok: false, message: "❌ 反映に失敗しました: " + error.message };
      added++;
    }

    if (added === 0) return { ok: false, message: "⚠️ すでに同じ日時・場所の体験会が登録されています" };
    return { ok: true, message: `✅ ${added}件をスケジュールに反映しました！${skipped > 0 ? `（${skipped}件は重複のためスキップ）` : ""}` };
  };

  return (
    <FlyerBase
      storageKey={`${teamConfig.storagePrefix}_trial_flyers`}
      title="体験会チラシ作成"
      fields={fields}
      renderPreview={Preview}
      onReflect={handleReflect}
    />
  );
}
