import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    const adminSecret = process.env.ADMIN_SECRET_KEY;

    if (!adminSecret) {
      return NextResponse.json({ error: "Admin key not configured" }, { status: 500 });
    }

    if (!key || key !== adminSecret) {
      // Constant-time-ish comparison to avoid timing attacks
      return NextResponse.json({ error: "Invalid administrative key" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
