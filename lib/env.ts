/** .env の値から余分な空白・引用符を除去する */
function cleanEnv(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

export function getSupabaseConfig(): {
  url: string;
  anonKey: string;
  error: string | null;
} {
  // Next.js はクライアントで process.env[name] を展開しないため、直接参照する
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return {
      url: "",
      anonKey: "",
      error:
        "Supabaseの環境変数が設定されていません。.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。",
    };
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) {
    return {
      url,
      anonKey,
      error:
        "NEXT_PUBLIC_SUPABASE_URL の形式が正しくありません。Supabaseの Project URL（https://xxxx.supabase.co）を引用符なしで設定してください。",
    };
  }

  return { url: url.replace(/\/$/, ""), anonKey, error: null };
}
