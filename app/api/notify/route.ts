import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import teamConfig from "@/lib/team-config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { childName, childGrade, parentName, trialDate, message } = body;

    const { data: setting } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "notification_email")
      .single();

    const to = setting?.value;
    if (!to) return Response.json({ ok: false, reason: "no email set" });

    await resend.emails.send({
      from: `${teamConfig.teamShortName} <onboarding@resend.dev>`,
      to,
      subject: `【${teamConfig.teamShortName}】新しい体験申込がありました`,
      html: `
        <h2>新しい体験申込が届きました</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5">お子さんのお名前</td><td style="padding:8px;border:1px solid #ddd">${childName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5">学年</td><td style="padding:8px;border:1px solid #ddd">${childGrade}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5">保護者のお名前</td><td style="padding:8px;border:1px solid #ddd">${parentName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5">体験希望日程</td><td style="padding:8px;border:1px solid #ddd">${trialDate}</td></tr>
          ${message ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5">メッセージ</td><td style="padding:8px;border:1px solid #ddd">${message}</td></tr>` : ""}
        </table>
        <p style="margin-top:16px"><a href="${teamConfig.siteUrl}/admin">管理画面を開く</a></p>
      `,
    });

    return Response.json({ ok: true });
  } catch (e) {
    console.error("notify error", e);
    return Response.json({ ok: false });
  }
}
