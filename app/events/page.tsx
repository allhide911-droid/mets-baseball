const events = [
  { date: "２０２５年１２月", name: "納会" },
  { date: "２０２６年１月", name: "新年会" },
  { date: "２０２６年２月", name: "卒団式" },
];

export default function EventsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">イベント</h1>
      <p className="text-gray-500 mb-10">チームで実施したイベントをご紹介します。</p>

      <div className="flex flex-col gap-4">
        {events.map((e, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5 flex gap-4">
            <div className="text-sm text-gray-400 w-36 flex-shrink-0 pt-0.5 whitespace-nowrap">{e.date}</div>
            <div>
              <p className="font-bold text-gray-800">{e.name}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-8 text-center">
        ※ データベース連携後、最新の情報が自動で表示されます
      </p>
    </div>
  );
}
