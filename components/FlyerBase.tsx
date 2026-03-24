"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import DateTimeRangePicker from "@/components/DateTimeRangePicker";

export type FlyerData = Record<string, string>;
export type FontSizes = Record<string, string>;
export type Alignments = Record<string, string>;

const SIZE_OPTIONS = [
  { label: "小", value: "0.8rem" },
  { label: "標準", value: "1rem" },
  { label: "大", value: "1.3rem" },
  { label: "特大", value: "1.7rem" },
];

type SavedFlyer = {
  id: string;
  name: string;
  createdAt: string;
  font: string;
  fontSizes: FontSizes;
  alignments: Alignments;
  imageData: string | null;
  imageType: string | null;
  data: FlyerData;
};

export const FONTS = [
  { label: "ゴシック体", value: "'Noto Sans JP', sans-serif" },
  { label: "明朝体", value: "'Noto Serif JP', serif" },
  { label: "丸ゴシック", value: "'M PLUS Rounded 1c', sans-serif" },
  { label: "手書き風", value: "'Zen Kurenaido', sans-serif" },
];

type Field = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  defaultValue?: string;
  checkbox?: boolean;
  datetimerange?: boolean;
};

type Props = {
  storageKey: string;
  title: string;
  fields: Field[];
  renderPreview: (data: FlyerData, font: string, fontSizes: FontSizes, alignments: Alignments, imageData: string | null, imageType: string | null) => ReactNode;
};

function AlignSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { label: "←", value: "left", title: "左揃え" },
    { label: "≡", value: "center", title: "中央揃え" },
    { label: "→", value: "right", title: "右揃え" },
  ];
  return (
    <div className="flex gap-1 mt-1">
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          onClick={() => onChange(o.value)}
          className={`px-2 py-0.5 rounded text-xs border transition ${value === o.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300 hover:border-blue-400"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SizeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 mt-1">
      {SIZE_OPTIONS.map(s => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          className={`px-2 py-0.5 rounded text-xs border transition ${value === s.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300 hover:border-blue-400"}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export default function FlyerBase({ storageKey, title, fields, renderPreview }: Props) {
  const [data, setData] = useState<FlyerData>({});
  const [font, setFont] = useState(FONTS[0].value);
  const [fontSizes, setFontSizes] = useState<FontSizes>({ title: "1.7rem" });
  const [alignments, setAlignments] = useState<Alignments>({ title: "center" });
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [savedFlyers, setSavedFlyers] = useState<SavedFlyer[]>([]);
  const [saveName, setSaveName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const setSize = (key: string, value: string) => setFontSizes(prev => ({ ...prev, [key]: value }));
  const getSize = (key: string, def = "1rem") => fontSizes[key] ?? def;
  const setAlign = (key: string, value: string) => setAlignments(prev => ({ ...prev, [key]: value }));
  const getAlign = (key: string, def = "left") => alignments[key] ?? def;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setSavedFlyers(JSON.parse(saved));
    const initial: FlyerData = {};
    fields.forEach(f => { initial[f.key] = f.defaultValue ?? ""; });
    setData(initial);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImageData(ev.target?.result as string); setImageType(file.type); };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const name = saveName.trim() || `チラシ ${new Date().toLocaleDateString("ja-JP")}`;
    const flyer: SavedFlyer = {
      id: editingId || Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      font,
      fontSizes,
      alignments,
      imageData,
      imageType,
      data,
    };
    const updated = editingId
      ? savedFlyers.map(f => f.id === editingId ? flyer : f)
      : [...savedFlyers, flyer];
    setSavedFlyers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setEditingId(flyer.id);
    setSaveName(name);
  };

  const handleLoad = (flyer: SavedFlyer) => {
    setData(flyer.data);
    setFont(flyer.font);
    setFontSizes(flyer.fontSizes ?? { title: "1.7rem" });
    setAlignments(flyer.alignments ?? { title: "center" });
    setImageData(flyer.imageData);
    setImageType(flyer.imageType);
    setEditingId(flyer.id);
    setSaveName(flyer.name);
  };

  const handleDelete = (id: string) => {
    const updated = savedFlyers.filter(f => f.id !== id);
    setSavedFlyers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    if (editingId === id) { setEditingId(null); setSaveName(""); }
  };

  const handleNew = () => {
    const initial: FlyerData = {};
    fields.forEach(f => { initial[f.key] = f.defaultValue ?? ""; });
    setData(initial);
    setFont(FONTS[0].value);
    setFontSizes({ title: "1.7rem" });
    setAlignments({ title: "center" });
    setImageData(null);
    setImageType(null);
    setEditingId(null);
    setSaveName("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6 print:hidden">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← 管理者ページ</Link>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>

      {/* 保存済み一覧 */}
      {savedFlyers.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 mb-6 print:hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700">保存済み（{savedFlyers.length}件）</h2>
            <button onClick={handleNew} className="text-xs text-blue-600 hover:underline">＋ 新規作成</button>
          </div>
          <div className="flex flex-col gap-2">
            {savedFlyers.map(f => (
              <div key={f.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${editingId === f.id ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}>
                <span className="text-sm font-medium text-gray-700">{f.name}</span>
                <div className="flex gap-3">
                  <button onClick={() => handleLoad(f)} className="text-xs text-blue-600 hover:underline">編集</button>
                  <button onClick={() => handleDelete(f.id)} className="text-xs text-red-500 hover:underline">削除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 入力フォーム */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 print:hidden">
        <h2 className="text-lg font-bold text-gray-700 mb-4">チラシ内容を入力</h2>
        <div className="grid grid-cols-1 gap-5">

          {/* タイトル文字サイズ・整列 */}
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <label className="text-sm font-bold text-gray-600 block mb-1">タイトルの文字サイズ・位置</label>
            <SizeSelector value={getSize("title", "1.7rem")} onChange={v => setSize("title", v)} />
            <AlignSelector value={getAlign("title", "center")} onChange={v => setAlign("title", v)} />
          </div>

          {/* 各フィールド */}
          {fields.map(field => (
            <div key={field.key}>
              <label className="text-sm font-bold text-gray-600 block mb-1">{field.label}</label>
              {field.datetimerange ? (
                <>
                  <DateTimeRangePicker
                    value={data[field.key] || ""}
                    onChange={v => setData({ ...data, [field.key]: v })}
                  />
                  <div className="flex gap-4 mt-1">
                    <SizeSelector value={getSize(field.key)} onChange={v => setSize(field.key, v)} />
                    <AlignSelector value={getAlign(field.key)} onChange={v => setAlign(field.key, v)} />
                  </div>
                </>
              ) : field.checkbox ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field.key}
                    checked={data[field.key] === "true"}
                    onChange={e => setData({ ...data, [field.key]: e.target.checked ? "true" : "false" })}
                    className="w-4 h-4"
                  />
                  <label htmlFor={field.key} className="text-sm text-gray-600">{field.placeholder}</label>
                </div>
              ) : field.multiline ? (
                <>
                  <textarea
                    value={data[field.key] || ""}
                    onChange={e => setData({ ...data, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex gap-4 mt-1">
                    <SizeSelector value={getSize(field.key)} onChange={v => setSize(field.key, v)} />
                    <AlignSelector value={getAlign(field.key)} onChange={v => setAlign(field.key, v)} />
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={data[field.key] || ""}
                    onChange={e => setData({ ...data, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex gap-4 mt-1">
                    <SizeSelector value={getSize(field.key)} onChange={v => setSize(field.key, v)} />
                    <AlignSelector value={getAlign(field.key)} onChange={v => setAlign(field.key, v)} />
                  </div>
                </>
              )}
            </div>
          ))}

          {/* フォント選択 */}
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-2">字体・フォント</label>
            <div className="flex flex-wrap gap-2">
              {FONTS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFont(f.value)}
                  style={{ fontFamily: f.value }}
                  className={`px-4 py-2 rounded-full text-sm border transition ${font === f.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 画像・PDFアップロード */}
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-2">画像・PDF をチラシに追加</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleImageUpload}
              className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageData && (
              <div className="mt-2 flex items-start gap-3">
                {imageType?.startsWith("image/") ? (
                  <img src={imageData} alt="追加画像" className="max-h-24 rounded border object-contain" />
                ) : (
                  <embed src={imageData} type="application/pdf" className="w-full h-40 rounded border" />
                )}
                <button onClick={() => { setImageData(null); setImageType(null); }} className="text-xs text-red-500 hover:underline shrink-0">削除</button>
              </div>
            )}
          </div>
        </div>

        {/* 保存・印刷 */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={saveName}
            onChange={e => setSaveName(e.target.value)}
            placeholder="チラシ名（例：4月体験会）"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
          />
          <button onClick={handleSave} className="bg-green-600 text-white font-bold px-6 py-2 rounded-full hover:bg-green-700 transition text-sm">
            💾 保存する
          </button>
          <button onClick={() => window.print()} className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition text-sm">
            🖨️ 印刷する
          </button>
        </div>
      </div>

      {/* プレビュー */}
      <div style={{ fontFamily: font }}>
        {renderPreview(data, font, fontSizes, alignments, imageData, imageType)}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&family=Noto+Serif+JP:wght@400;700;900&family=M+PLUS+Rounded+1c:wght@400;700;800&family=Zen+Kurenaido&display=swap');
        @media print {
          .print\\:hidden { display: none !important; }
          header { display: none !important; }
          nav { display: none !important; }
          @page { size: A4 portrait; margin: 10mm; }
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .flyer-preview { width: 190mm; min-height: 277mm; box-sizing: border-box; page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
