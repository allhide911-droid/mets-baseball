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


export default function Home() {
  return (
    <div>
      {/* ヒーローセクション */}
      <section className="relative text-white px-8 py-16" style={{ backgroundImage: "url('/Gemini_Generated_Image_4hkuxd4hkuxd4hku (1).png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-4">
            <Image src="/logo.png" alt="昭島美堀メッツ ロゴ" width={300} height={95} className="object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight text-white drop-shadow-lg">
            一緒に野球しよう！
          </h1>
          <p className="text-2xl mb-8 font-black text-white drop-shadow-lg">
            小学生大募集!!!初心者、女の子も大歓迎です!!
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">体験会・体験希望日カレンダー</h2>
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
