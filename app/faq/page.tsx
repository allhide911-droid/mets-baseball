const costs = [
  { label: "入会金", amount: "3,000円", note: "初回のみ" },
  { label: "月会費", amount: "3,000円", note: "２年生以下は月会費が2,000円です。" },
  { label: "用具代", amount: "自己負担", note: "グローブ・バット等は各自でご用意頂きますが、バットは貸出の相談可能です。" },
];

const faqs = [
  {
    q: "未経験でも入れますか？",
    a: "もちろんです！野球未経験の子どもも多く在籍しています。基礎から丁寧に指導しますので安心してください。",
  },
  {
    q: "練習を休んでも大丈夫ですか？",
    a: "学校行事や家族の都合による欠席は問題ありません。無理なく続けられる環境を大切にしています。",
  },
  {
    q: "保護者のお手伝いは必要ですか？",
    a: "保護者のご協力はありますが、送迎や当番は無理のない範囲で分担し、状況に応じて柔軟に対応しています。",
  },
  {
    q: "何年生から入れますか？",
    a: "年長さんから小学6年生まで入団できます。学年を超えて仲良く練習しています。",
  },
  {
    q: "体験参加は何回でもできますか？",
    a: "何度でも体験いただけます。納得してから入団を決めてください。",
  },
  {
    q: "練習場所はどこですか？",
    a: "主に拝島第二小学校校庭、エコパークグランドで練習しています。",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">費用・よくある質問</h1>
      <p className="text-gray-500 mb-10">入団前に気になることをまとめました。</p>

      {/* 費用 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">費用について</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">項目</th>
                <th className="py-3 px-4 text-left">金額</th>
                <th className="py-3 px-4 text-left">備考</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost, i) => (
                <tr key={i} className="border-t">
                  <td className="py-3 px-4 font-medium text-gray-800">{cost.label}</td>
                  <td className="py-3 px-4 font-bold text-blue-700">{cost.amount}</td>
                  <td className="py-3 px-4 text-gray-500">{cost.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6">よくある質問</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5">
              <p className="font-bold text-blue-700 mb-2">Q. {faq.q}</p>
              <p className="text-gray-700 text-sm leading-relaxed">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
