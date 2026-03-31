"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type TeamInfo = {
  description: string;
  founded_year: string;
  member_count: string;
  practice_days: string;
  practice_location: string;
};

export default function AboutPage() {
  const [info, setInfo] = useState<TeamInfo | null>(null);

  useEffect(() => {
    supabase.from("team_info").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) setInfo(data as TeamInfo);
    });
  }, []);

  const stats = info ? [
    { label: "創設", value: info.founded_year },
    { label: "部員数", value: info.member_count },
    { label: "練習日", value: info.practice_days },
    { label: "練習場所", value: info.practice_location },
  ] : [
    { label: "創設", value: "１９９０年" },
    { label: "部員数", value: "計２４名（２０２６年３月現在）" },
    { label: "練習日", value: "土・日曜日・祝日" },
    { label: "練習場所", value: "拝島第二小学校・エコパーク・くじら公園" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">チーム紹介</h1>
      <p className="text-gray-500 mb-10">私たちのチームについてご紹介します。</p>

      <section className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-bold text-blue-700 mb-4">チームについて</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          {info?.description ?? "昭島美堀メッツは、平成２年（１９９０年）に誕生した昭島少年野球連盟傘下のチームです。野球を通じ健康で礼儀正しい少年少女の育成をはかると共に、部員相互の親睦と友情を深め常に感謝の気持ちと、苦境に打ち勝つ強い精神力を持ち、将来の社会生活適合できる為の、健全な子供の育成を目的としています。"}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {stats.map(s => (
            <div key={s.label} className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-gray-500">{s.label}</p>
              <p className="font-bold text-blue-700">{s.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
