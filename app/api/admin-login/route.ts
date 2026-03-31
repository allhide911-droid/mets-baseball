export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return Response.json({ ok: false, error: "サーバーの設定が不完全です" }, { status: 500 });
  }

  if (password === adminPassword) {
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: "パスワードが違います" }, { status: 401 });
}
