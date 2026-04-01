"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import teamConfig from "@/lib/team-config";

export default function ResumeChatBanner() {
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem(teamConfig.localStorageKey);
    if (!id) return;
    supabase
      .from("applicants")
      .select("id")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setChatId(id);
        } else {
          localStorage.removeItem(teamConfig.localStorageKey);
        }
      });
  }, []);

  if (!chatId) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-blue-800">💬 前回のチャットの続きはこちら</p>
        <p className="text-xs text-blue-600 mt-0.5">スタッフからの返信を確認できます</p>
      </div>
      <Link
        href={`/chat/${chatId}`}
        className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-blue-700 transition whitespace-nowrap"
      >
        チャットを開く
      </Link>
    </div>
  );
}
