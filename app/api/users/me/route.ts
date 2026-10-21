import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL; // база з /api

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", cookie: cookieStore.toString() },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}