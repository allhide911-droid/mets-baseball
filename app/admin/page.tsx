"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const ADMIN_PASSWORD = "mets2024";

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
  created_at: string;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [latestMessages, setLatestMessages] = useState<Record<string, LatestMessage>>({});

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplicants();
      const interval = setInterval(fetchApplicants, 10000);
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
        .select("applicant_id, sender, created_at")
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

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
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

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          管理者ログイン
        </h1>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="パスワードを入力"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <h1 className="text-2xl font-bold text-gray-800">管理者ページ</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:underline"
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
      </div>

      <h2 className="text-lg font-bold text-gray-700 mb-4">
        申込者一覧（{applicants.length}件）
      </h2>

      <div className="flex flex-col gap-3">
        {applicants.length === 0 && (
          <p className="text-gray-400">申込者はまだいません</p>
        )}
        {applicants.map((a) => {
          const latest = latestMessages[a.id];
          const hasNewMessage = latest?.sender === "applicant";

          return (
            <div
              key={a.id}
              className={`bg-white rounded-xl shadow p-4 flex items-center justify-between ${
                hasNewMessage ? "border-l-4 border-red-400" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-800">
                    {a.child_name}{" "}
                    <span className="text-sm text-gray-500">（{a.child_grade}）</span>
                  </p>
                  {hasNewMessage && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">保護者：{a.parent_name}</p>
                <p className="text-sm text-gray-400">
                  {new Date(a.created_at).toLocaleDateString("ja-JP")} 申込
                </p>
                {latest && (
                  <p className="text-sm text-gray-400">
                    最新コメント：{new Date(latest.created_at).toLocaleString("ja-JP", {
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {latest.sender === "applicant" ? "（申込者）" : "（スタッフ）"}
                  </p>
                )}
              </div>
              <Link
                href={`/admin/chat/${a.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap ml-4"
              >
                チャットを開く
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
