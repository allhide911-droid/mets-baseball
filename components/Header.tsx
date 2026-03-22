"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">
          昭島美堀メッツ少年野球チームメンバー募集
        </Link>

        {/* PC用ナビ */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link href="/about" className="hover:text-blue-600">チーム紹介</Link>
          <Link href="/faq" className="hover:text-blue-600">費用・FAQ</Link>
          <Link href="/results" className="hover:text-blue-600">大会実績</Link>
          <Link href="/events" className="hover:text-blue-600">イベント</Link>
          <Link href="/trial" className="hover:text-blue-600">体験会日程</Link>
          <Link href="/apply" className="bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700">
            体験申込
          </Link>
        </nav>

        {/* スマホ用ハンバーガー */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-2xl">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* スマホ用メニュー */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          <Link href="/about" onClick={() => setMenuOpen(false)}>チーム紹介</Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)}>費用・FAQ</Link>
          <Link href="/results" onClick={() => setMenuOpen(false)}>大会実績</Link>
          <Link href="/events" onClick={() => setMenuOpen(false)}>イベント</Link>
          <Link href="/trial" onClick={() => setMenuOpen(false)}>体験会日程</Link>
          <Link href="/apply" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-full text-center">
            体験申込
          </Link>
        </nav>
      )}
    </header>
  );
}
