const coaches = [
  {
    name: "田中 太郎",
    role: "監督",
    career: "元社会人野球選手。20年以上の指導経験を持つ。",
    policy: "「野球を通じて人間力を育てる」をモットーに、技術だけでなく礼儀・思いやりを大切にした指導を行っています。",
    initial: "田",
    color: "bg-blue-500",
  },
  {
    name: "山田 次郎",
    role: "コーチ（打撃担当）",
    career: "元高校野球部主将。打撃指導歴10年。",
    policy: "「バットを振ることを楽しむ」を大切にし、子どものペースに合わせて丁寧に指導します。",
    initial: "山",
    color: "bg-green-500",
  },
  {
    name: "佐藤 三郎",
    role: "コーチ（守備担当）",
    career: "大学野球部出身。守備・ピッチング専門。",
    policy: "基礎をしっかり身につけることが成長への近道。焦らず丁寧に教えます。",
    initial: "佐",
    color: "bg-orange-500",
  },
];

export default function CoachesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">指導者紹介</h1>
      <p className="text-gray-500 mb-10">経験豊富なスタッフが丁寧に指導します。</p>

      <div className="flex flex-col gap-6">
        {coaches.map((coach) => (
          <div key={coach.name} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
            <div className={`${coach.color} text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0 mx-auto md:mx-0`}>
              {coach.initial}
            </div>
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-gray-800">{coach.name}</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full w-fit">
                  {coach.role}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-3">経歴：{coach.career}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 font-bold mb-1">指導方針</p>
                <p className="text-gray-700 text-sm leading-relaxed">{coach.policy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
