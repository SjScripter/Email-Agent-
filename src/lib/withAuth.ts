import { NextRequest, NextResponse } from "next/server";
import { requireAuthFromRequest } from "@/lib/auth";

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    if (!requireAuthFromRequest(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req);
  };
}
