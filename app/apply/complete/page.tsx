import Link from "next/link";

export default function CompletePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">⚾</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">申し込みが完了しました！</h1>
      <p className="text-gray-600 mb-2">
        ご入力いただいたメールアドレスに確認メールをお送りします。
      </p>
      <p className="text-gray-600 mb-8">
        当日お会いできることを楽しみにしています！
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800 mb-8 text-left">
        <p className="font-bold mb-2">📋 体験会当日について</p>
        <ul className="list-disc list-inside space-y-1">
          <li>動きやすい服装・運動靴でお越しください</li>
          <li>水筒をご持参ください</li>
          <li>雨天中止の場合は前日にメールでご連絡します</li>
        </ul>
      </div>

      <Link
        href="/"
        className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
