"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type LoginError = {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
    details?: string;
  };
};

type LoginData = { accessToken: string };

export type LoginState = { ok: true } | { ok: false; error: string };

export async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { ok: false, error: "Missing email or password" };
  }

  const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    let errMsg = "Login failed";
    try {
      const failedJson: LoginError | ApiSuccess<LoginData> = await res.json();
      if ("success" in failedJson && failedJson.success === false) {
        errMsg = failedJson.error.message || errMsg;
      }
    } catch {}
    return { ok: false, error: errMsg };
  }

  let json: ApiSuccess<LoginData> | LoginError;
  try {
    json = await res.json();
  } catch {
    return { ok: false, error: "サーバー応答の形式が不正です。" };
  }

  if (!json.success) {
    return { ok: false, error: json.error.message || "Login failed" };
  }

  const token = json.data.accessToken;

  const cookieStore = await cookies();
  cookieStore.set({
    name: "_access",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect("/", RedirectType.replace);
  return { ok: true };
}
