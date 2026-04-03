"use client";

import Link from "next/link";

export default function AdminManualPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800 print:px-0 print:py-0 print:text-[11pt]">
      <div className="print:hidden flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-blue-600 text-sm hover:underline">← 管理者ページ</Link>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white font-bold px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition"
        >
          🖨️ PDFで保存・印刷する
        </button>
      </div>

      {/* 表紙 */}
      <div className="mb-10 border-b-2 border-blue-700 pb-6">
        <p className="text-sm text-blue-600 font-bold tracking-widest mb-1">昭島美堀メッツ少年野球チーム</p>
        <h1 className="text-4xl font-black text-blue-800 mb-2">管理者操作マニュアル</h1>
        <p className="text-gray-500 text-sm">サイトURL：https://mets-baseball.vercel.app/admin</p>
      </div>

      {/* 目次 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10 print:rounded-none">
        <h2 className="font-bold text-blue-800 mb-3">目次</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-900">
          <li>管理者ログイン・ログアウト</li>
          <li>申込者一覧の見かた</li>
          <li>申込者へのチャット返信</li>
          <li>一括メッセージ送信</li>
          <li>申込者の削除</li>
          <li>体験会スケジュールの管理</li>
          <li>体験会チラシの作成・印刷</li>
          <li>メンバー募集チラシの作成・印刷</li>
          <li>コンテンツの編集</li>
          <li>よくあるトラブルと対処法</li>
        </ol>
      </div>

      {/* 1. ログイン */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">1. 管理者ログイン・ログアウト</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div className="bg-gray-50 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
            <p className="font-bold mb-1">ログイン方法</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>サイトトップページ右下の小さな「管理者ログイン」をクリック</li>
              <li>パスワードを入力して「ログイン」を押す</li>
              <li>申込者一覧画面が表示されれば完了</li>
            </ol>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
            <p className="font-bold text-yellow-800 mb-1">⚠️ 注意</p>
            <p>パスワードは他の人に教えないでください。ログイン状態はブラウザに保存されます。共有端末を使った後は必ずログアウトしてください。</p>
          </div>
          <p><strong>ログアウト</strong>：管理者ページ右上の「ログアウト」をクリックするだけです。</p>
        </div>
      </section>

      {/* 2. 申込者一覧 */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">2. 申込者一覧の見かた</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>ログイン後の画面に、体験申込をした方の一覧が新しい順に表示されます。</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-blue-200 px-3 py-2 text-left">表示内容</th>
                <th className="border border-blue-200 px-3 py-2 text-left">説明</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-200 px-3 py-2">お子さんの名前・学年</td><td className="border border-gray-200 px-3 py-2">申込時に入力された情報</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2">保護者名・希望日</td><td className="border border-gray-200 px-3 py-2">申込時に入力された情報</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2">最新メッセージ</td><td className="border border-gray-200 px-3 py-2">チャットの最後のやりとり（青＝申込者、緑＝スタッフ）</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2">申込日</td><td className="border border-gray-200 px-3 py-2">フォームが送信された日付</td></tr>
            </tbody>
          </table>
          <p>一覧は<strong>10秒ごとに自動更新</strong>されます。手動でページを更新する必要はありません。</p>
        </div>
      </section>

      {/* 3. チャット */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">3. 申込者へのチャット返信</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <ol className="list-decimal list-inside space-y-2">
            <li>申込者カードの「チャットを開く」ボタンをクリック</li>
            <li>画面下部のテキストボックスにメッセージを入力</li>
            <li>「返信」ボタンを押す（またはEnterキー）</li>
          </ol>
          <div className="bg-gray-50 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
            <p className="font-bold mb-1">便利な機能</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>↩ 1つ前に戻す</strong>：直前に送ったスタッフのメッセージを削除できます</li>
              <li><strong>この申込を削除</strong>：ページ右上にあります。申込者とメッセージをまとめて削除します</li>
              <li>チャットは<strong>5秒ごとに自動更新</strong>されます</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
            <p className="font-bold text-green-800 mb-1">申込者側の動作</p>
            <p>申込者がチャットページを開いていない間にこちらが返信しても、次回開いたときに表示されます。申込を削除した場合、申込者がURLを開くと自動的にトップページに戻ります。</p>
          </div>
        </div>
      </section>

      {/* 4. 一括メッセージ */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">4. 一括メッセージ送信</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>複数の申込者に同じメッセージをまとめて送れます。中止連絡など全員への通知に便利です。</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>申込者一覧の各カード左側のチェックボックスで送信先を選ぶ<br /><span className="text-gray-500 ml-4">「全選択」ボタンで全員を一括選択できます</span></li>
            <li>「一括返信」欄にメッセージを入力</li>
            <li>「選択中○件に送信」ボタンを押す</li>
          </ol>
        </div>
      </section>

      {/* 5. 削除 */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">5. 申込者の削除</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>申込者の情報とチャット履歴をすべて削除します。入部が決まった方や、キャンセルになった方に使います。</p>
          <div className="bg-gray-50 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
            <p className="font-bold mb-1">削除の方法（2通り）</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>一覧から削除</strong>：申込者カード右下の赤い「削除」ボタン</li>
              <li><strong>チャット画面から削除</strong>：チャット画面右上の「この申込を削除」</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
            <p className="font-bold text-red-700 mb-1">⚠️ 削除は取り消せません</p>
            <p>削除すると申込者情報・チャット履歴がすべて消えます。削除前に確認ダイアログが表示されるので、よく確認してから実行してください。</p>
          </div>
        </div>
      </section>

      {/* 6. 体験会スケジュール */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">6. 体験会スケジュールの管理</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>管理者ページの「⚾ 体験会を管理する」から開きます。トップページのカレンダーに表示される日程を管理します。</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-blue-200 px-3 py-2 text-left">操作</th>
                <th className="border border-blue-200 px-3 py-2 text-left">方法</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">追加</td><td className="border border-gray-200 px-3 py-2">日付・時間・場所を入力して「追加する」を押す</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">削除</td><td className="border border-gray-200 px-3 py-2">一覧の「削除」ボタンを押す</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">チラシから反映</td><td className="border border-gray-200 px-3 py-2">体験会チラシ作成画面の「スケジュールに反映する」ボタンで自動追加</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. 体験会チラシ */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">7. 体験会チラシの作成・印刷</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>管理者ページの「🖨️ 体験会チラシを作成」から開きます。</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>日時①（必須）・場所（必須）を入力</li>
            <li>必要に応じて日時②・持ち物・備考・コメントを入力</li>
            <li>画像（集合写真など）をアップロードするとチラシに追加されます</li>
            <li>プレビューを確認して「💾 保存する」</li>
            <li>「🖨️ 印刷する」でPDF保存・印刷</li>
          </ol>
          <div className="bg-gray-50 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
            <p className="font-bold mb-1">保存済みチラシの操作</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>編集</strong>：保存済み一覧の「編集」で読み込んで修正</li>
              <li><strong>複写</strong>：既存チラシをコピーして新しいチラシのベースに使える</li>
              <li><strong>削除</strong>：削除後1分間は「元に戻す」で復元可能</li>
              <li><strong>スケジュールに反映する</strong>：入力した日時・場所をカレンダーに自動登録</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. 募集チラシ */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">8. メンバー募集チラシの作成・印刷</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>管理者ページの「📣 メンバー募集チラシを作成」から開きます。</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>集合写真をアップロード（任意）</li>
            <li>撮影日を入力（例：2026.02 撮影）</li>
            <li>QRコードの表示・非表示を選択</li>
            <li>「💾 保存する」でチラシを保存</li>
            <li>「🖨️ 印刷する」でPDF保存・印刷</li>
          </ol>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 print:bg-white print:border print:border-gray-200">
            <p className="text-sm">チラシのレイアウト（練習日・費用・保護者向け案内など）はあらかじめ設定されています。変更したい場合はスタッフにご相談ください。</p>
          </div>
        </div>
      </section>

      {/* 9. コンテンツ管理 */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">9. コンテンツの編集</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>管理者ページの「📝 コンテンツを管理する」から、サイトに表示される各種情報を編集できます。</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-blue-200 px-3 py-2 text-left">タブ</th>
                <th className="border border-blue-200 px-3 py-2 text-left">編集できる内容</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">チームについて</td><td className="border border-gray-200 px-3 py-2">チーム紹介文・設立年・人数・練習場所など</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">費用</td><td className="border border-gray-200 px-3 py-2">月会費・入会費など費用の追加・編集・削除</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">よくある質問</td><td className="border border-gray-200 px-3 py-2">FAQの追加・編集・削除</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">大会実績</td><td className="border border-gray-200 px-3 py-2">大会名・成績の追加・編集・削除</td></tr>
              <tr><td className="border border-gray-200 px-3 py-2 font-bold">イベント</td><td className="border border-gray-200 px-3 py-2">年間イベントの追加・編集・削除</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 10. トラブル */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white bg-blue-700 px-4 py-2 rounded-lg mb-4 print:rounded-none">10. よくあるトラブルと対処法</h2>
        <div className="space-y-4 text-sm leading-relaxed">
          {[
            { q: "ログインできない", a: "パスワードを再確認してください。大文字・小文字が違う場合があります。" },
            { q: "申込者が一覧に表示されない", a: "ページを再読み込みしてください。申込直後は10秒ほどで反映されます。" },
            { q: "チャットの返信が届かない", a: "申込者がURLを知っている必要があります。申込完了後にURLが表示されます。申込を削除した後は申込者がアクセスできなくなります。" },
            { q: "チラシが2ページに分かれて印刷される", a: "印刷ダイアログで「余白：なし」または「拡大縮小：ページに合わせる」に設定してください。" },
            { q: "画像をアップロードしたらエラーになる", a: "ファイルサイズが7MB以下の画像を選んでください。スマホで撮影した写真はサイズが大きいことがあります。" },
            { q: "スケジュールに反映したが、カレンダーに表示されない", a: "すでに同じ日時・場所が登録済みの場合はスキップされます。体験会管理ページで確認してください。" },
          ].map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden print:rounded-none">
              <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700">Q. {item.q}</div>
              <div className="px-4 py-2 text-gray-600">A. {item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
        昭島美堀メッツ少年野球チーム 管理者マニュアル｜https://mets-baseball.vercel.app
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          header, nav, footer { display: none !important; }
          @page { size: A4 portrait; margin: 12mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 10pt; }
          section { page-break-inside: avoid; break-inside: avoid; margin-bottom: 20pt; }
          h2 { font-size: 12pt; padding: 4pt 8pt; }
          table { page-break-inside: avoid; break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
