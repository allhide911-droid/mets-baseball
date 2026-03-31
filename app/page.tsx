import Link from "next/link";
import Image from "next/image";
import HowToUseModal from "@/components/HowToUseModal";
import TrialCalendar from "@/components/TrialCalendar";
import NextTrial from "@/components/NextTrial";
import ResumeChatBanner from "@/components/ResumeChatBanner";
import teamConfig from "@/lib/team-config";


export default function Home() {
  return (
    <div style={{ backgroundColor: "white" }}>
      {/* ヒーローセクション */}
      <section className="relative text-white px-8 py-16" style={{ backgroundImage: "url('/hero.png.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-4">
            <Image src="/logo.png" alt={`${teamConfig.teamShortName} ロゴ`} width={300} height={95} className="object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight text-white drop-shadow-lg">
            {teamConfig.catchphrase}
          </h1>
          <p className="text-2xl mb-8 font-black text-white drop-shadow-lg">
            {teamConfig.subCatchphrase}
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

      {/* 前回チャット再開バナー */}
      <section className="max-w-5xl mx-auto px-4 pt-6">
        <ResumeChatBanner />
      </section>

      {/* メニュー案内 */}
      <section className="max-w-5xl mx-auto px-4 pt-8" style={{ backgroundColor: "white" }}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm" style={{ color: "#1f2937" }}>
          📋 右上メニューから<strong>チーム紹介・費用・FAQ・大会実績・イベント・体験会日程</strong>がご覧いただけます。
        </div>
      </section>

      {/* カレンダー＋次回体験会 */}
      <section className="max-w-5xl mx-auto px-4 py-10" style={{ backgroundColor: "white" }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#1f2937" }}>体験会・体験日カレンダー</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <TrialCalendar />
          <NextTrial />
        </div>
      </section>



    </div>
  );
}
