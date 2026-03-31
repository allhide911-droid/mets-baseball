"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Cost = { id: string; label: string; amount: string; note: string; sort_order: number; };
type FAQ = { id: string; question: string; answer: string; sort_order: number; };

export default function FAQPage() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    supabase.from("costs").select("*").order("sort_order").then(({ data }) => setCosts((data as Cost[]) ?? []));
    supabase.from("faqs").select("*").order("sort_order").then(({ data }) => setFaqs((data as FAQ[]) ?? []));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">費用・よくある質問</h1>
      <p className="text-gray-500 mb-10">入団前に気になることをまとめました。</p>

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
              {costs.length === 0 && (
                <tr><td colSpan={3} className="py-6 text-center text-gray-400">読み込み中...</td></tr>
              )}
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
          {faqs.length === 0 && <p className="text-center text-gray-400 py-6">読み込み中...</p>}
        </div>
      </section>
    </div>
  );
}
