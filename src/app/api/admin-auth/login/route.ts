import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE,
  createAdminSessionToken,
  getAdminAuthConfig,
  getAdminSessionTtlSeconds,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    const { adminEmail, adminPassword } = getAdminAuthConfig();

    if (
      email !== adminEmail.trim().toLowerCase() ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 },
      );
    }

    const token = createAdminSessionToken(adminEmail.trim().toLowerCase());
    const response = NextResponse.json({
      success: true,
      user: { id: "admin", email: adminEmail.trim().toLowerCase() },
    });

    response.cookies.set(ADMIN_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getAdminSessionTtlSeconds(),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Auth configuration missing on server." },
      { status: 500 },
    );
  }
}
