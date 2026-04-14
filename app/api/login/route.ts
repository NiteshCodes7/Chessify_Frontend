import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sessionToken, refreshToken } = await req.json();

    if (!sessionToken || !refreshToken) {
      return NextResponse.json(
        { message: "Missing tokens" },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ ok: true });

    const isProd = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    res.cookies.set("sessionToken", sessionToken, cookieOptions);
    res.cookies.set("refreshToken", refreshToken, cookieOptions);

    return res;
  } catch {
    return NextResponse.json(
      { message: "Failed to set session" },
      { status: 500 }
    );
  }
}