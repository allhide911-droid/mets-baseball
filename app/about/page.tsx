import Image from "next/image";

const photos = [
  { label: "練習風景②", bg: "bg-green-200", src: null },
  { label: "試合の様子", bg: "bg-yellow-200", src: null },
  { label: "チーム集合写真", bg: "bg-red-200", src: null },
  { label: "表彰式", bg: "bg-purple-200", src: null },
  { label: "交流戦", bg: "bg-pink-200", src: null },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">チーム紹介</h1>
      <p className="text-gray-500 mb-10">私たちのチームについてご紹介します。</p>

      {/* チーム概要 */}
      <section className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-bold text-blue-700 mb-4">チームについて</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          昭島美堀メッツは、平成２年（１９９０年）に誕生した昭島少年野球連盟傘下のチームです。
          野球を通じ健康で礼儀正しい少年少女の育成をはかると共に、部員相互の親睦と友情を深め常に感謝の気持ちと、苦境に打ち勝つ強い精神力を持ち、将来の社会生活適合できる為の、健全な子供の育成を目的としています。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-gray-500">創設</p>
            <p className="font-bold text-blue-700">１９９０年</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-gray-500">部員数</p>
            <p className="font-bold text-blue-700">計２４名</p>
            <p className="font-bold text-blue-700 text-xs">（２０２６年３月現在）</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-gray-500">練習日</p>
            <p className="font-bold text-blue-700">土・日曜日・祝日</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-gray-500">練習場所</p>
            <p className="font-bold text-blue-700">拝島第二小学校・エコパーク・くじら公園</p>
          </div>
        </div>
      </section>

      {/* 活動写真ギャラリー */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6">活動写真ギャラリー</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.label}
              className={`${photo.bg} rounded-xl h-40 overflow-hidden relative flex items-center justify-center text-gray-600 font-medium text-sm`}
            >
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover"
                />
              ) : (
                photo.label
              )}
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-4 text-center">
          ※ 実際の写真はSupabase連携後に表示されます
        </p>
      </section>
    </div>
  );
}
