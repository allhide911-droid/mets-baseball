"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Message = {
  id: string;
  sender: "applicant" | "admin";
  content: string;
  created_at: string;
};

type Applicant = {
  id: string;
  child_name: string;
  parent_name: string;
  trial_date: string;
  message: string;
};

export default function ChatPage() {
  const { id } = useParams() as { id: string };
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showBookmarkBanner, setShowBookmarkBanner] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchApplicant = async () => {
      const { data } = await supabase
        .from("applicants")
        .select("id, child_name, parent_name, trial_date, message")
        .eq("id", id)
        .single();
      if (data) setApplicant(data as Applicant);
    };
    fetchApplicant();

    // 初回訪問時のみブックマークバナーを表示
    const bookmarkKey = `bookmarked_${id}`;
    if (!localStorage.getItem(bookmarkKey)) {
      setShowBookmarkBanner(true);
    }
  }, [id]);

  const dismissBookmarkBanner = () => {
    localStorage.setItem(`bookmarked_${id}`, "true");
    setShowBookmarkBanner(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("applicant_id", id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    await supabase.from("messages").insert({
      applicant_id: id,
      sender: "applicant",
      content: input.trim(),
    });
    setInput("");
    setSending(false);
    fetchMessages();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 text-sm hover:underline">
        ← トップに戻る
      </Link>

      <div className="mt-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {applicant ? `${applicant.child_name}さんの申込チャット` : "チャット"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          昭島美堀メッツのスタッフに質問・連絡ができます。
        </p>
      </div>

      {/* ブックマーク案内バナー */}
      {showBookmarkBanner && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-yellow-800">🔖 このページをブックマーク登録してください</p>
            <p className="text-xs text-yellow-700 mt-1">
              このURLは再発行できません。スタッフからの返信を確認するために、ブラウザのブックマーク（お気に入り）に保存しておいてください。
            </p>
          </div>
          <button
            onClick={dismissBookmarkBanner}
            className="text-yellow-600 hover:text-yellow-800 text-lg font-bold shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* 申込内容の確認 */}
      {applicant && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs font-bold text-blue-700 mb-2">📄 申込内容</p>
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="text-gray-500 shrink-0">体験希望日程</span>
              <span className="font-medium">{applicant.trial_date || "未定"}</span>
            </div>
            {applicant.message && (
              <div className="flex gap-2">
                <span className="text-gray-500 shrink-0">備考</span>
                <span>{applicant.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* チャット */}
      <div className="bg-gray-50 rounded-xl border p-4 h-80 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm my-auto">
            メッセージを送ってください。スタッフが確認次第返信します。
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "applicant" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "applicant"
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-800"
              }`}
            >
              {msg.sender === "admin" && (
                <p className="text-xs text-gray-500 mb-1 font-bold">スタッフ</p>
              )}
              <p>{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "applicant" ? "text-blue-200" : "text-gray-400"
                }`}
              >
                {new Date(msg.created_at).toLocaleString("ja-JP", {
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="メッセージを入力..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          送信
        </button>
      </div>
    </div>
  );
}
