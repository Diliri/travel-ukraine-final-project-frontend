import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// TODO: коли Тімлід заповнить app/api/api.ts та _utils/utils.ts — замінити на їхній інстанс/хелпер.
const BACKEND_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL; // база з /api на кінці

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const formData = await request.formData();

  const res = await fetch(`${BACKEND_URL}/users/avatar`, {
    method: "PATCH",
    headers: { cookie: cookieStore.toString() },
    body: formData,
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
