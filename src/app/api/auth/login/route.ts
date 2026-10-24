import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = process.env.APP_PASSWORD;
    if (!password) {
      return NextResponse.json({ error: "APP_PASSWORD not configured" }, { status: 500 });
    }
    if (body.password === password) {
      await setAuthCookie();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}
