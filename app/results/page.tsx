const tournaments = [
  { year: "２０２５年１１月", name: "昭島シニア杯", result: "優勝", note: "" },
  { year: "２０２５年１１月", name: "TAMAチャンピオン大会", result: "準優勝", note: "" },
  { year: "２０２６年１月", name: "わらべやカップ", result: "３位", note: "" },
];

export default function ResultsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">大会実績</h1>
      <p className="text-gray-500 mb-10">チームのこれまでの大会成績をご紹介します。</p>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-left">年月</th>
              <th className="py-3 px-4 text-left">大会名</th>
              <th className="py-3 px-4 text-left">結果</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-500">{t.year}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{t.name}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    t.result === "優勝" ? "bg-yellow-100 text-yellow-700" :
                    t.result === "準優勝" ? "bg-gray-100 text-gray-600" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {t.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-400 text-xs mt-6 text-center">
        ※ データベース連携後、最新の情報が自動で表示されます
      </p>
    </div>
  );
}
