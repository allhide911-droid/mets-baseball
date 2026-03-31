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
    try {
      const { error } = await supabase.from("messages").insert({
        applicant_id: id,
        sender: "applicant",
        content: input.trim(),
      });
      if (!error) {
        setInput("");
        fetchMessages();
      }
    } finally {
      setSending(false);
    }
  };

  const handleUndo = async () => {
    const { data } = await supabase
      .from("messages")
      .select("id")
      .eq("applicant_id", id)
      .eq("sender", "applicant")
      .order("created_at", { ascending: false })
      .limit(1);
    if (!data || data.length === 0) return;
    if (!confirm("最後に送ったメッセージを削除しますか？")) return;
    await supabase.from("messages").delete().eq("id", data[0].id);
    fetchMessages();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <Link href="/" className="text-blue-600 text-sm hover:underline">
        ← トップに戻る
      </Link>

      <div className="mt-4 mb-4">
        <h1 className="text-2xl font-bold" style={{ color: "#4169E1" }}>
          {applicant ? `${applicant.child_name}さんの申込チャット` : "チャット"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#4169E1" }}>
          昭島美堀メッツのスタッフに質問・連絡ができます。
        </p>
      </div>


      {/* 体験日程に関するご案内 */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm text-yellow-800">
          ⚾ 体験は1ヶ月を目処に入部可否をお考えください。<br />
          試合・遠征などと重なると対応できかねるため、体験日はやり取りの上決めさせて頂きます。
        </p>
      </div>

      {/* 再開方法の案内 */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
        <span className="text-2xl shrink-0">📱</span>
        <div>
          <p className="text-sm font-bold text-green-800">このチャットはいつでも再開できます</p>
          <p className="text-xs text-green-700 mt-1">
            次回は <strong>トップページ</strong> を開くと「前回のチャットの続きはこちら」ボタンが表示されます。そこからすぐに戻れます。
          </p>
        </div>
      </div>

      {/* 申込内容の確認 */}
      {applicant && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs font-bold mb-2" style={{ color: "#4169E1" }}>📄 申込内容</p>
          <div className="flex flex-col gap-1 text-sm" style={{ color: "#4169E1" }}>
            <div className="flex gap-2">
              <span className="shrink-0" style={{ color: "#4169E1" }}>体験日程</span>
              <span className="font-medium">{applicant.trial_date || "未定"}</span>
            </div>
            {applicant.message && (
              <div className="flex gap-2">
                <span className="shrink-0" style={{ color: "#4169E1" }}>備考</span>
                <span>{applicant.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* チャット */}
      <div className="bg-gray-50 rounded-xl border p-4 h-80 overflow-y-auto flex flex-col gap-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-sm my-auto" style={{ color: "#4169E1" }}>
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
                <p className="text-xs mb-1 font-bold" style={{ color: "#4169E1" }}>スタッフ</p>
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
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ backgroundColor: "white", WebkitTextFillColor: "#111827", WebkitBoxShadow: "0 0 0px 1000px white inset" }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          送信
        </button>
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={handleUndo}
          className="text-xs font-bold px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          style={{ color: "#4169E1" }}
        >
          ↩ 1つ前に戻す
        </button>
      </div>
    </div>
  );
}
