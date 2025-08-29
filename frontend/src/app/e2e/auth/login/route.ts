import { NextResponse } from "next/server";

// Mock Server
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({} as unknown));
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "Missing email or password" },
      },
      { status: 400 }
    );
  }

  if (password === "wrong") {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "メールまたはパスワードが違います",
        },
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: { accessToken: "dummy_access_token" },
    },
    { status: 200 }
  );
}
