import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("/api/auth/register", body, {
      headers: {
        "Accept-Language": req.headers.get("accept-language") || "uk",
      },
    });

    const cookieStore = await cookies();
    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parseSetCookie(cookieStr);
        if (!parsed?.name || parsed.value === undefined) continue;

        cookieStore.set(parsed.name, parsed.value, {
          path: parsed.path || "/",
          httpOnly: parsed.httpOnly,
          secure: parsed.secure,
          sameSite: parsed.sameSite as "lax" | "strict" | "none" | undefined,
          expires: parsed.expires,
          maxAge: parsed.maxAge,
        });
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data || {
        status,
        message: "Сталася внутрішня помилка сервера",
      };

      return NextResponse.json(data, { status });
    }

    return NextResponse.json(
      { status: 500, message: "Сталася внутрішня помилка сервера" },
      { status: 500 },
    );
  }
}
