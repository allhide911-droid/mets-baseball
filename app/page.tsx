import Link from "next/link";
import Image from "next/image";
import HowToUseModal from "@/components/HowToUseModal";
import TrialCalendar from "@/components/TrialCalendar";
import NextTrial from "@/components/NextTrial";

const features = [
  { icon: "😄", title: "楽しく", desc: "勝ち負けより野球を好きになることを大切にしています" },
  { icon: "🛡️", title: "安心", desc: "経験豊富な指導者が安全第一で指導します" },
  { icon: "🏆", title: "実績", desc: "地区大会で上位入賞の実績があります" },
];

const recentResults = [
  { date: "2026/03/15", opponent: "東部ライオンズ", score: "5-3", result: "勝ち" },
  { date: "2026/03/08", opponent: "西部タイガース", score: "2-4", result: "負け" },
  { date: "2026/03/01", opponent: "南部イーグルス", score: "7-7", result: "引き分け" },
];


export default function Home() {
  return (
    <div>
      {/* ヒーローセクション */}
      <section
        className="relative text-white px-8"
        style={{
          backgroundImage: "url('/Gemini_Generated_Image_f9sru0f9sru0f9sr.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          minHeight: "85vh",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: "3rem",
        }}
      >
        {/* 下部グラデーションオーバーレイ（文字を読みやすく） */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,20,0.75) 0%, rgba(0,0,20,0.3) 50%, rgba(0,0,0,0) 100%)"
        }} />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="mb-4">
            <Image src="/logo.png" alt="昭島美堀メッツ ロゴ" width={300} height={95} className="object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight text-white"
            style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>
            一緒に野球しよう！
          </h1>
          <p className="text-xl mb-8 font-bold text-white"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8)" }}>
            小学生はもちろん、年長さん・初心者・女の子も大歓迎。<br />体験申込いつでも受付中です。
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/apply"
              className="bg-yellow-400 text-gray-900 font-black px-10 py-4 rounded-full text-xl hover:bg-yellow-300 transition shadow-lg"
            >
              体験を申し込む
            </Link>
            <HowToUseModal />
          </div>
        </div>

        {/* 管理者ログインボタン */}
        <div className="absolute bottom-4 right-4">
          <Link
            href="/admin"
            className="text-white/40 text-xs hover:text-white/70 transition"
          >
            管理者ログイン
          </Link>
        </div>
      </section>

      {/* カレンダー＋次回体験会 */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">体験会・体験希望者カレンダー</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <TrialCalendar />
          <NextTrial />
        </div>
      </section>

      {/* チームの特徴 */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          私たちのチームの特徴
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
