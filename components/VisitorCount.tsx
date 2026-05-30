"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const increment = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "visitor_count")
        .single();

      const current = parseInt(data?.value || "0");
      const next = current + 1;

      await supabase
        .from("settings")
        .update({ value: String(next) })
        .eq("key", "visitor_count");

      setCount(next);
    };
    increment();
  }, []);

  if (count === null) return null;

  return (
    <p className="text-gray-400 text-xs text-center mt-2">
      閲覧数：{count}回
    </p>
  );
}