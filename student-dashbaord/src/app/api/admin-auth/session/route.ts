import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const payload = verifyAdminSessionToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: { id: "admin", email: payload.email },
    },
    { status: 200 },
  );
}
