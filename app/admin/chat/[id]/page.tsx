"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  child_grade: string;
  parent_name: string;
  trial_date: string;
  message: string;
};

export default function AdminChatPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    const fetchApplicant = async () => {
      const { data } = await supabase
        .from("applicants")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setApplicant(data as Applicant);
    };
    fetchApplicant();
  }, [id]);

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
      sender: "admin",
      content: input.trim(),
    });
    setInput("");
    setSending(false);
    fetchMessages();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/admin" className="text-blue-600 text-sm hover:underline">
        ← 申込者一覧に戻る
      </Link>

      {applicant && (
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {applicant.child_name}さん（{applicant.child_grade}）
          </h1>
          <p className="text-gray-500 text-sm">
            保護者：{applicant.parent_name}　体験希望日：{applicant.trial_date || "未定"}
          </p>
          {applicant.message && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
              <p className="text-xs font-bold text-yellow-700 mb-1">📋 申込時の備考</p>
              <p className="text-sm text-gray-700">{applicant.message}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 rounded-xl border p-4 h-96 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm my-auto">
            まだメッセージはありません
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-800"
              }`}
            >
              {msg.sender === "applicant" && (
                <p className="text-xs text-gray-500 mb-1 font-bold">
                  {applicant?.child_name}さん
                </p>
              )}
              <p>{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "admin" ? "text-blue-200" : "text-gray-400"
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
          placeholder="返信を入力..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          返信
        </button>
      </div>
    </div>
  );
}
