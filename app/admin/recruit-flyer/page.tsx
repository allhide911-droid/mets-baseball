"use client";

import FlyerBase, { FlyerData } from "@/components/FlyerBase";
import { QRCodeSVG } from "qrcode.react";
import teamConfig from "@/lib/team-config";

const APPLY_URL = `${teamConfig.siteUrl}/apply`;

const fields = [
  { key: "photoDate", label: "撮影日", placeholder: "例：2026.02 撮影", defaultValue: "2026.02 撮影" },
  { key: "showQR", label: "QRコードを表示する", placeholder: "QRコードを表示する", checkbox: true, defaultValue: "true" },
];

function TemplatePreview(imageData: string | null, photoDate: string, showQR: boolean) {
  return (
    <div
      className="flyer-preview flyer-recruit print:shadow-none"
      style={{
        fontFamily: "'Meiryo UI', 'Meiryo', sans-serif",
        border: "2px solid #1e3a8a",
        background: "white",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ヘッダー */}
      <div style={{ padding: "10px 16px 12px", borderBottom: "2px solid #1e3a8a" }}>
        <div style={{ color: "#4169E1", fontWeight: 900, fontSize: "clamp(4.5rem, 14.5vw, 5.9rem)", fontStyle: "italic", letterSpacing: "0.03em", textAlign: "center", lineHeight: 1.0 }}>
          {teamConfig.teamShortName}
        </div>
        <div style={{ fontWeight: 900, fontSize: "clamp(3.0rem, 10.5vw, 4.2rem)", letterSpacing: "0.15em", color: "#111", lineHeight: 1.0, textAlign: "center", whiteSpace: "nowrap" }}>
          野球しようぜ！
        </div>
      </div>

      {/* 集合写真 */}
      <div style={{ position: "relative" }}>
        <div style={{ background: "linear-gradient(to bottom, #4169E1 0%, rgba(65,105,225,0.12) 50%, #4169E1 100%)", minHeight: "160px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.35)" }}>
          {imageData ? (
            <img src={imageData} alt="集合写真" style={{ width: "80%", objectFit: "contain", display: "block", margin: "0 auto", filter: "brightness(1.08)" }} />
          ) : (
            <span style={{ color: "#9ca3af", fontSize: "0.85rem", padding: "40px" }}>集合写真をアップロードしてください</span>
          )}
        </div>
        <div style={{ textAlign: "right", fontSize: "0.68rem", color: "#374151", paddingRight: "4px", marginTop: "2px" }}>
          {photoDate}
        </div>
      </div>

      {/* 本文 2列 */}
      <div style={{ display: "flex", gap: "10px", padding: "10px 14px 6px", fontSize: "1.14rem", lineHeight: 1.65, overflow: "hidden" }}>
        {/* 左カラム */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "1.3rem" }}><strong>[練習日]</strong><span style={{ fontSize: "1.05rem" }}>（試合などで変動あります）</span></p>
          <p style={{ fontSize: "1.3rem" }}>土　　　　9:00〜13:00　@ エコパーク</p>
          <p style={{ fontSize: "1.3rem", whiteSpace: "nowrap" }}>日・祝日　9:00〜17:00　@ 拝島第二小学校　くじら運動公園</p>
          <p style={{ marginTop: "6px" }}><strong>[部費]</strong></p>
          <p>￥1,000　入会時のみ</p>
          <p>￥3,000　/ 毎月（合宿積立金込）</p>
          <p style={{ marginTop: "6px" }}><strong>[用具]</strong></p>
          <p>チームにバットなど中古品あります</p>
          <p>貸出しなどお気軽にご相談ください</p>
          <p style={{ marginTop: "6px" }}><strong>[イベント]</strong></p>
          <p>1月：初詣・新年会</p>
          <p>8月：合宿（川遊びなど）</p>
          <p>12月：納会（出し物）など</p>
        </div>

        {/* 右ボックス */}
        <div style={{ width: "52%", flexShrink: 0, alignSelf: "flex-start", marginTop: "calc(1.3rem * 1.65 * 4 + 6px)", border: "2px solid #4169E1", borderRadius: "6px", padding: "8px 10px", fontSize: "1.1rem", lineHeight: 1.65, boxShadow: "0 0 14px rgba(65,105,225,0.45)" }}>
          <p style={{ fontWeight: "bold", color: "#1e3a8a", marginBottom: "5px" }}>小学1〜6年生までの軟式野球チーム</p>
          <p>初心者・女子も大歓迎！　指導して頂ける保護者も大歓迎！</p>
          <div style={{ borderTop: "1px solid #c7d2fe", marginTop: "8px", paddingTop: "6px", fontSize: "1.0rem", lineHeight: 1.65 }}>
            <p><strong>[保護者の方へ]</strong></p>
            <p>メッツは監督・コーチ・選手・保護者の距離がとても近く、親子で野球を楽しめます♫</p>
            <p>保護者の当番は、選手の見守りがメインで、1カ月〜2カ月に1回（半日）程度です！お気軽に親子で見学・体験にきてください</p>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div style={{ background: "#4169E1", color: "white", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <div style={{ fontWeight: "bold", fontSize: "1.76rem", lineHeight: 1.5, flexShrink: 0 }}>
          <p>見学・体験・入部</p>
          <p>随時受付中</p>
        </div>
        {showQR && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "1.64rem", fontWeight: "bold", textAlign: "right", lineHeight: 1.5 }}>
              <p>QRコードから申込・問合せ・</p>
              <p>相談のチャットもできます</p>
            </div>
            <div style={{ background: "white", padding: "5px", borderRadius: "4px", flexShrink: 0 }}>
              <QRCodeSVG value={APPLY_URL} size={110} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Preview(data: FlyerData, _font: string, _fontSizes: unknown, _alignments: unknown, imageData: string | null) {
  return TemplatePreview(imageData, data.photoDate || "2026.02 撮影", data.showQR !== "false");
}

export default function RecruitFlyerPage() {
  return (
    <FlyerBase
      storageKey={`${teamConfig.storagePrefix}_recruit_flyers`}
      title="メンバー募集チラシ作成"
      fields={fields}
      renderPreview={Preview}
    />
  );
}
