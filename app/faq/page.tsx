"use client";

import { useState, useEffect } from "react";
import { supabase, getSupabaseConfigError } from "@/lib/supabase";

type Cost = { id: string; label: string; amount: string; note: string; sort_order: number; };
type FAQ = { id: string; question: string; answer: string; sort_order: number; };

export default function FAQPage() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);

      const configError = getSupabaseConfigError();
      if (configError) {
        setError(configError);
        setLoading(false);
        return;
      }

      try {
        const [{ data: costData, error: costError }, { data: faqData, error: faqError }] =
          await Promise.all([
            supabase.from("costs").select("*").order("sort_order", { ascending: true }),
            supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
          ]);

        if (costError) console.error("Failed to fetch costs:", costError);
        if (faqError) console.error("Failed to fetch faqs:", faqError);

        setCosts((costData as Cost[]) ?? []);
        setFaqs((faqData as FAQ[]) ?? []);

        if (costError || faqError) {
          const isNetwork =
            costError?.message === "TypeError: Failed to fetch" ||
            faqError?.message === "TypeError: Failed to fetch";
          setError(
            isNetwork
              ? "Supabaseに接続できません。.env.local の NEXT_PUBLIC_SUPABASE_URL が Supabase ダッシュボードの Project URL と一致しているか確認し、値の前後に引用符（\"）を付けないでください。開発サーバーは .env.local 変更後に再起動してください。"
              : "データの取得に失敗しました。Supabaseに costs / faqs テーブルがあるか、SQL（supabase/content-tables.sql）を実行済みか確認してください。",
          );
        }
      } catch (e) {
        console.error("Failed to fetch costs/faqs:", e);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">費用・よくある質問</h1>
      <p className="text-gray-500 mb-10">入団前に気になることをまとめました。</p>

      {loading ? (
        <p className="text-center text-gray-400 py-10">読み込み中...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-sm py-10">{error}</p>
      ) : (
        <>
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
                  {costs.map((cost) => (
                    <tr key={cost.id} className="border-t">
                      <td className="py-3 px-4 font-medium text-gray-800">{cost.label}</td>
                      <td className="py-3 px-4 font-bold text-blue-700">{cost.amount}</td>
                      <td className="py-3 px-4 text-gray-500">{cost.note}</td>
                    </tr>
                  ))}
                  {costs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-400">データがありません</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-6">よくある質問</h2>
            <div className="flex flex-col gap-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-xl shadow p-5">
                  <p className="font-bold text-blue-700 mb-2">Q. {faq.question}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">A. {faq.answer}</p>
                </div>
              ))}
              {faqs.length === 0 ? <p className="text-center text-gray-400 py-6">データがありません</p> : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
