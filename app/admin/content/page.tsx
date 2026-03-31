"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Tab = "about" | "costs" | "faq" | "results" | "events";

function parseYM(text: string): number {
  const normalized = text.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  const m = normalized.match(/(\d+)年(\d+)月/);
  if (!m) return 0;
  return parseInt(m[1]) * 100 + parseInt(m[2]);
}

type TeamInfo = {
  id: number;
  description: string;
  founded_year: string;
  member_count: string;
  practice_days: string;
  practice_location: string;
};

type Cost = { id: string; label: string; amount: string; note: string; sort_order: number; };
type FAQ = { id: string; question: string; answer: string; sort_order: number; };
type Tournament = { id: string; year_month: string; name: string; result: string; sort_order: number; };
type Event = { id: string; date: string; name: string; sort_order: number; };

function AboutTab() {
  const [form, setForm] = useState({ description: "", founded_year: "", member_count: "", practice_days: "", practice_location: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("team_info").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) setForm({ description: data.description ?? "", founded_year: data.founded_year ?? "", member_count: data.member_count ?? "", practice_days: data.practice_days ?? "", practice_location: data.practice_location ?? "" });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("team_info").upsert({ id: 1, ...form });
    setSaving(false);
    setMsg(error ? "❌ 保存に失敗しました" : "✅ 保存しました");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">チーム説明文</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: "founded_year", label: "創設年" },
          { key: "member_count", label: "部員数" },
          { key: "practice_days", label: "練習日" },
          { key: "practice_location", label: "練習場所" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
            <input type="text" value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition text-sm disabled:opacity-50">
          {saving ? "保存中..." : "保存する"}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </div>
    </div>
  );
}

function CostsTab() {
  const [items, setItems] = useState<Cost[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "", amount: "", note: "" });
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("costs").select("*").order("sort_order");
    setItems((data as Cost[]) ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.label || !form.amount) return;
    if (editId) { await supabase.from("costs").update(form).eq("id", editId); }
    else { await supabase.from("costs").insert({ ...form, sort_order: items.length }); }
    setForm({ label: "", amount: "", note: "" }); setEditId(null); setAdding(false);
    await load(); setMsg("✅ 保存しました"); setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除してよいですか？")) return;
    await supabase.from("costs").delete().eq("id", id); await load();
  };

  const handleEdit = (item: Cost) => { setEditId(item.id); setForm({ label: item.label, amount: item.amount, note: item.note ?? "" }); setAdding(true); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700">費用一覧</h3>
        {!adding && <button onClick={() => { setAdding(true); setEditId(null); setForm({ label: "", amount: "", note: "" }); }}
          className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">＋ 追加</button>}
      </div>
      {adding && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">項目名 *</label>
              <input type="text" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">金額 *</label>
              <input type="text" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">備考</label>
            <input type="text" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">保存</button>
            <button onClick={() => { setAdding(false); setEditId(null); }} className="text-gray-500 text-sm hover:underline px-3">キャンセル</button>
          </div>
        </div>
      )}
      {msg && <p className="text-sm text-green-600">{msg}</p>}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b">
            <th className="py-2 px-4 text-left font-bold text-gray-600">項目</th>
            <th className="py-2 px-4 text-left font-bold text-gray-600">金額</th>
            <th className="py-2 px-4 text-left font-bold text-gray-600">備考</th>
            <th className="py-2 px-4" />
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="py-2.5 px-4 font-medium text-gray-800">{item.label}</td>
                <td className="py-2.5 px-4 text-blue-700 font-bold">{item.amount}</td>
                <td className="py-2.5 px-4 text-gray-500">{item.note}</td>
                <td className="py-2.5 px-4"><div className="flex gap-2 justify-end">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 text-xs hover:underline">編集</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs hover:underline">削除</button>
                </div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-gray-400 text-sm">データがありません</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQTab() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    setItems((data as FAQ[]) ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.question || !form.answer) return;
    if (editId) { await supabase.from("faqs").update(form).eq("id", editId); }
    else { await supabase.from("faqs").insert({ ...form, sort_order: items.length }); }
    setForm({ question: "", answer: "" }); setEditId(null); setAdding(false);
    await load(); setMsg("✅ 保存しました"); setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除してよいですか？")) return;
    await supabase.from("faqs").delete().eq("id", id); await load();
  };

  const handleEdit = (item: FAQ) => { setEditId(item.id); setForm({ question: item.question, answer: item.answer }); setAdding(true); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700">FAQ一覧</h3>
        {!adding && <button onClick={() => { setAdding(true); setEditId(null); setForm({ question: "", answer: "" }); }}
          className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">＋ 追加</button>}
      </div>
      {adding && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">質問 *</label>
            <input type="text" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">回答 *</label>
            <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">保存</button>
            <button onClick={() => { setAdding(false); setEditId(null); }} className="text-gray-500 text-sm hover:underline px-3">キャンセル</button>
          </div>
        </div>
      )}
      {msg && <p className="text-sm text-green-600">{msg}</p>}
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <p className="font-bold text-blue-700 text-sm mb-1">Q. {item.question}</p>
                <p className="text-gray-600 text-sm">A. {item.answer}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(item)} className="text-blue-600 text-xs hover:underline">編集</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs hover:underline">削除</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 text-sm py-6">データがありません</p>}
      </div>
    </div>
  );
}

function ResultsTab() {
  const [items, setItems] = useState<Tournament[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ year_month: "", name: "", result: "" });
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("tournaments").select("*");
    const sorted = ((data as Tournament[]) ?? []).sort((a, b) => parseYM(a.year_month) - parseYM(b.year_month));
    setItems(sorted);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.year_month || !form.name || !form.result) return;
    if (editId) { await supabase.from("tournaments").update(form).eq("id", editId); }
    else { await supabase.from("tournaments").insert({ ...form, sort_order: items.length }); }
    setForm({ year_month: "", name: "", result: "" }); setEditId(null); setAdding(false);
    await load(); setMsg("✅ 保存しました"); setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除してよいですか？")) return;
    await supabase.from("tournaments").delete().eq("id", id); await load();
  };

  const handleEdit = (item: Tournament) => { setEditId(item.id); setForm({ year_month: item.year_month, name: item.name, result: item.result }); setAdding(true); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700">大会実績一覧</h3>
        {!adding && <button onClick={() => { setAdding(true); setEditId(null); setForm({ year_month: "", name: "", result: "" }); }}
          className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">＋ 追加</button>}
      </div>
      {adding && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">年月 *</label>
              <input type="text" placeholder="例：２０２６年４月" value={form.year_month} onChange={e => setForm(f => ({ ...f, year_month: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">大会名 *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">結果 *</label>
              <input type="text" placeholder="例：優勝・準優勝・３位" value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">保存</button>
            <button onClick={() => { setAdding(false); setEditId(null); }} className="text-gray-500 text-sm hover:underline px-3">キャンセル</button>
          </div>
        </div>
      )}
      {msg && <p className="text-sm text-green-600">{msg}</p>}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b">
            <th className="py-2 px-4 text-left font-bold text-gray-600">年月</th>
            <th className="py-2 px-4 text-left font-bold text-gray-600">大会名</th>
            <th className="py-2 px-4 text-left font-bold text-gray-600">結果</th>
            <th className="py-2 px-4" />
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="py-2.5 px-4 text-gray-500">{item.year_month}</td>
                <td className="py-2.5 px-4 font-medium text-gray-800">{item.name}</td>
                <td className="py-2.5 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.result === "優勝" ? "bg-yellow-100 text-yellow-700" : item.result === "準優勝" ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"}`}>{item.result}</span>
                </td>
                <td className="py-2.5 px-4"><div className="flex gap-2 justify-end">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 text-xs hover:underline">編集</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs hover:underline">削除</button>
                </div></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-gray-400 text-sm">データがありません</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventsTab() {
  const [items, setItems] = useState<Event[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ date: "", name: "" });
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("events").select("*");
    const sorted = ((data as Event[]) ?? []).sort((a, b) => parseYM(a.date) - parseYM(b.date));
    setItems(sorted);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.date || !form.name) return;
    if (editId) { await supabase.from("events").update(form).eq("id", editId); }
    else { await supabase.from("events").insert({ ...form, sort_order: items.length }); }
    setForm({ date: "", name: "" }); setEditId(null); setAdding(false);
    await load(); setMsg("✅ 保存しました"); setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除してよいですか？")) return;
    await supabase.from("events").delete().eq("id", id); await load();
  };

  const handleEdit = (item: Event) => { setEditId(item.id); setForm({ date: item.date, name: item.name }); setAdding(true); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700">イベント一覧</h3>
        {!adding && <button onClick={() => { setAdding(true); setEditId(null); setForm({ date: "", name: "" }); }}
          className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">＋ 追加</button>}
      </div>
      {adding && (
        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">日付 *</label>
              <input type="text" placeholder="例：２０２６年４月" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">イベント名 *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">保存</button>
            <button onClick={() => { setAdding(false); setEditId(null); }} className="text-gray-500 text-sm hover:underline px-3">キャンセル</button>
          </div>
        </div>
      )}
      {msg && <p className="text-sm text-green-600">{msg}</p>}
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{item.date}</p>
              <p className="font-bold text-gray-800">{item.name}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(item)} className="text-blue-600 text-xs hover:underline">編集</button>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs hover:underline">削除</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 text-sm py-6">データがありません</p>}
      </div>
    </div>
  );
}

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("about");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-2">管理者ログインが必要です。</p>
        <Link href="/admin" className="text-blue-600 hover:underline">管理者ページへ →</Link>
      </div>
    );
  }

  const tabs = [
    { key: "about", label: "チーム紹介" },
    { key: "costs", label: "費用" },
    { key: "faq", label: "FAQ" },
    { key: "results", label: "大会実績" },
    { key: "events", label: "イベント" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm">← 管理者ページ</Link>
        <h1 className="text-2xl font-bold text-gray-800">コンテンツ管理</h1>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "about" && <AboutTab />}
      {tab === "costs" && <CostsTab />}
      {tab === "faq" && <FAQTab />}
      {tab === "results" && <ResultsTab />}
      {tab === "events" && <EventsTab />}
    </div>
  );
}
