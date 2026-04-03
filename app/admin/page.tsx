"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import teamConfig from "@/lib/team-config";

type Applicant = {
  id: string;
  child_name: string;
  child_grade: string;
  parent_name: string;
  trial_date: string;
  status: string;
  created_at: string;
};

type LatestMessage = {
  applicant_id: string;
  sender: "applicant" | "admin";
  content: string;
  created_at: string;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [latestMessages, setLatestMessages] = useState<Record<string, LatestMessage>>({});
  const [notifyEmail, setNotifyEmail] = useState("");
  const [emailSaveMsg, setEmailSaveMsg] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkMsg, setBulkMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplicants();
      const interval = setInterval(fetchApplicants, 10000);
      supabase.from("settings").select("value").eq("key", "notification_email").single()
        .then(({ data }) => { if (data?.value) setNotifyEmail(data.value); });
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchApplicants = async () => {
    const { data: applicantData } = await supabase
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false });

    if (applicantData) {
      setApplicants(applicantData as Applicant[]);

      // 各申込者の最新メッセージを取得
      const { data: msgData } = await supabase
        .from("messages")
        .select("applicant_id, sender, content, created_at")
        .order("created_at", { ascending: false });

      if (msgData) {
        const latest: Record<string, LatestMessage> = {};
        for (const msg of msgData) {
          if (!latest[msg.applicant_id]) {
            latest[msg.applicant_id] = msg as LatestMessage;
          }
        }
        setLatestMessages(latest);
      }
    }
  };

  const handleLogin = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setError("パスワードが違います");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const handleSaveEmail = async () => {
    await supabase.from("settings").upsert({ key: "notification_email", value: notifyEmail });
    setEmailSaveMsg("✅ 保存しました");
    setTimeout(() => setEmailSaveMsg(""), 3000);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkSend = async () => {
    if (!bulkMessage.trim() || selectedIds.size === 0 || bulkSending) return;
    setBulkSending(true);
    for (const id of selectedIds) {
      await supabase.from("messages").insert({ applicant_id: id, sender: "admin", content: bulkMessage.trim() });
    }
    setBulkMessage("");
    setSelectedIds(new Set());
    setBulkSending(false);
    setBulkMsg(`✅ ${selectedIds.size}件に送信しました`);
    setTimeout(() => setBulkMsg(""), 3000);
    fetchApplicants();
  };

  const handleUndoLastMessage = async (applicantId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("id, sender")
      .eq("applicant_id", applicantId)
      .eq("sender", "admin")
      .order("created_at", { ascending: false })
      .limit(1);
    if (!data || data.length === 0) return;
    if (!confirm("最後に送ったメッセージを削除しますか？")) return;
    await supabase.from("messages").delete().eq("id", data[0].id);
    fetchApplicants();
  };

  const handleDeleteApplicant = async (id: string, name: string) => {
    if (!confirm(`「${name}」の申込を削除してもよいですか？`)) return;
    await supabase.from("messages").delete().eq("applicant_id", id);
    await supabase.from("applicants").delete().eq("id", id);
    await fetchApplicants();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          管理者ログイン
        </h1>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="パスワードを入力"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white font-bold py-2 rounded-full hover:bg-blue-700 transition"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#4169E1" }}>管理者ページ</h1>
        <button
          onClick={handleLogout}
          className="text-sm font-medium hover:underline"
          style={{ color: "#333333" }}
        >
          ログアウト
        </button>
      </div>

      {/* 管理メニュー */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/admin/trials"
          className="inline-block bg-green-600 text-white font-bold px-6 py-2 rounded-full hover:bg-green-700 transition text-sm"
        >
          ⚾ 体験会を管理する
        </Link>
        <Link
          href="/admin/flyer"
          className="inline-block bg-orange-500 text-white font-bold px-6 py-2 rounded-full hover:bg-orange-600 transition text-sm"
        >
          🖨️ 体験会チラシを作成
        </Link>
        <Link
          href="/admin/recruit-flyer"
          className="inline-block bg-purple-600 text-white font-bold px-6 py-2 rounded-full hover:bg-purple-700 transition text-sm"
        >
          📣 メンバー募集チラシを作成
        </Link>
        <Link
          href="/admin/content"
          className="inline-block bg-teal-600 text-white font-bold px-6 py-2 rounded-full hover:bg-teal-700 transition text-sm"
        >
          📝 コンテンツを管理する
        </Link>
        <Link
          href="/admin/manual"
          className="inline-block bg-gray-600 text-white font-bold px-6 py-2 rounded-full hover:bg-gray-700 transition text-sm"
        >
          📖 操作マニュアル
        </Link>
      </div>


      <h2 className="text-lg font-bold mb-4" style={{ color: "#4169E1" }}>
        申込者一覧（{applicants.length}件）
      </h2>

      {/* 一括返信 */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-700">📨 一括返信</h3>
          <div className="flex gap-3 text-xs">
            <button onClick={() => setSelectedIds(new Set(applicants.map(a => a.id)))} className="text-blue-600 hover:underline">全選択</button>
            <button onClick={() => setSelectedIds(new Set())} className="text-gray-600 font-medium hover:underline">解除</button>
          </div>
        </div>
        <textarea
          value={bulkMessage}
          onChange={e => setBulkMessage(e.target.value)}
          placeholder="送信するメッセージを入力（チェックした申込者全員に送られます）"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none mb-2"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkSend}
            disabled={bulkSending || !bulkMessage.trim() || selectedIds.size === 0}
            className="bg-blue-600 text-white font-bold px-5 py-2 rounded-full text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {bulkSending ? "送信中..." : `選択中${selectedIds.size}件に送信`}
          </button>
          {bulkMsg && <span className="text-green-600 text-sm font-bold">{bulkMsg}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {applicants.length === 0 && (
          <p className="text-gray-700">申込者はまだいません</p>
        )}
        {applicants.map((a) => {
          const latest = latestMessages[a.id];
          const readAt = typeof window !== "undefined" ? localStorage.getItem(`${teamConfig.storagePrefix}_read_${a.id}`) : null;
          const hasNewMessage = latest?.sender === "applicant" && (!readAt || new Date(latest.created_at) > new Date(readAt));
          const noChat = !latest;

          return (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(a.id)}
                onChange={() => toggleSelect(a.id)}
                className="w-4 h-4 mr-3 flex-shrink-0 accent-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-bold" style={{ color: "#000000" }}>
                    {a.child_name}{" "}
                    <span className="text-sm font-semibold" style={{ color: "#222222" }}>（{a.child_grade}）</span>
                  </p>
                </div>
                <p className="text-sm font-medium" style={{ color: "#222222" }}>保護者：{a.parent_name}</p>
                <p className="text-sm font-medium" style={{ color: "#222222" }}>
                  希望日：{a.trial_date || "未定"}
                </p>
                <p className="text-sm font-medium" style={{ color: "#222222" }}>
                  {new Date(a.created_at).toLocaleDateString("ja-JP")} 申込
                </p>
                {latest && (
                  <div className="mt-1 px-2 py-1 bg-gray-50 rounded-lg max-w-xs">
                    <p className="text-xs font-bold mb-0.5" style={{ color: latest.sender === "applicant" ? "#2563eb" : "#16a34a" }}>
                      {latest.sender === "applicant" ? "👤 申込者" : "🟢 スタッフ"}
                      <span className="font-normal text-gray-400 ml-2">
                        {new Date(latest.created_at).toLocaleString("ja-JP", {
                          month: "numeric",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                    <p className="text-sm truncate" style={{ color: "#444444" }}>{latest.content}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <Link
                  href={`/admin/chat/${a.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap text-center"
                >
                  チャットを開く
                </Link>
                <button
                  onClick={() => handleUndoLastMessage(a.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-600 transition whitespace-nowrap"
                >
                  ↩ 1つ前に戻す
                </button>
                <button
                  onClick={() => handleDeleteApplicant(a.id, a.child_name)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition whitespace-nowrap"
                >
                  削除
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
