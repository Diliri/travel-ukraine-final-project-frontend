import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/profile", "/stories/create"];
const authRoutes = ["/login", "/register"];

type ParsedCookie = {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
};

function parseSetCookie(cookieString: string): ParsedCookie | null {
  const parts = cookieString.split(";").map((part) => part.trim());
  const [rawNameValue, ...attributes] = parts;

  if (!rawNameValue || !rawNameValue.includes("=")) {
    return null;
  }

  const [name, ...valueParts] = rawNameValue.split("=");
  const value = valueParts.join("=");

  if (!name) {
    return null;
  }

  const parsed: ParsedCookie = { name, value };

  for (const attribute of attributes) {
    if (!attribute) continue;

    const lower = attribute.toLowerCase();

    if (lower.startsWith("path=")) {
      parsed.path = attribute.slice(5);
    }

    if (lower.startsWith("domain=")) {
      parsed.domain = attribute.slice(7);
    }

    if (lower.startsWith("expires=")) {
      parsed.expires = new Date(attribute.slice(8));
    }

    if (lower === "httponly") {
      parsed.httpOnly = true;
    }

    if (lower === "secure") {
      parsed.secure = true;
    }

    if (lower.startsWith("samesite=")) {
      const sameSite = attribute.slice(9).toLowerCase();
      if (sameSite === "strict" || sameSite === "lax" || sameSite === "none") {
        parsed.sameSite = sameSite;
      }
    }
  }

  return parsed;
}

function getCookieValueFromHeaders(
  setCookieHeaders: string[] | string | undefined,
  cookieName: string,
): string | undefined {
  if (!setCookieHeaders) return undefined;

  const headers = Array.isArray(setCookieHeaders)
    ? setCookieHeaders
    : [setCookieHeaders];

  for (const header of headers) {
    const parsed = parseSetCookie(header);
    if (parsed && parsed.name === cookieName) {
      return parsed.value;
    }
  }

  return undefined;
}

function setCookiesIfPresent(response: NextResponse, cookiesList: string[]) {
  if (!cookiesList || cookiesList.length === 0) {
    return;
  }

  cookiesList.forEach((cookieString) => {
    const parsed = parseSetCookie(cookieString);

    if (!parsed || !parsed.name || typeof parsed.value !== "string") {
      return;
    }

    let sameSite: "strict" | "lax" | "none" | undefined;

    if (typeof parsed.sameSite === "string") {
      const normalized = parsed.sameSite.toLowerCase();
      if (normalized === "strict" || normalized === "lax" || normalized === "none") {
        sameSite = normalized;
      }
    }

    response.cookies.set({
      name: parsed.name,
      value: parsed.value,
      path: parsed.path || "/",
      domain: parsed.domain || undefined,
      expires: parsed.expires ? new Date(parsed.expires) : undefined,
      httpOnly: parsed.httpOnly ?? undefined,
      secure: parsed.secure ?? undefined,
      sameSite,
    });
  });
}

function isMatchingRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let sessionResponseCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      const refreshResponse = await fetch(refreshUrl, {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      });

      if (refreshResponse.ok) {
        const setCookieHeaders = refreshResponse.headers.getSetCookie?.() ?? [];
        sessionResponseCookies = Array.isArray(setCookieHeaders)
          ? setCookieHeaders
          : [setCookieHeaders];

        const nextAccessToken = getCookieValueFromHeaders(
          sessionResponseCookies,
          "accessToken",
        );

        if (nextAccessToken) {
          accessToken = nextAccessToken;
        }
      }
    } catch (error) {
      console.error("Failed to refresh session in proxy:", error);
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    isMatchingRoute(pathname, route),
  );
  const isAuthRoute = authRoutes.some((route) =>
    isMatchingRoute(pathname, route),
  );

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);

    const response = NextResponse.redirect(loginUrl);
    setCookiesIfPresent(response, sessionResponseCookies);
    return response;
  }

  if (isAuthRoute && accessToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    setCookiesIfPresent(response, sessionResponseCookies);
    return response;
  }

  const response = NextResponse.next();
  setCookiesIfPresent(response, sessionResponseCookies);
  return response;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/stories/create",
    "/stories/:path*/edit",
    "/login",
    "/register",
  ],
};
