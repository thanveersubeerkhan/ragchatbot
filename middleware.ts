// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value || null;
  const url = req.nextUrl.clone();

  const adminOnly = ["/upload"];
  const protectedRoutes = ["/chat", "/upload"];

  if (protectedRoutes.some(r => url.pathname.startsWith(r))) {
    if (!role) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (adminOnly.some(r => url.pathname.startsWith(r)) && role !== "admin") {
      url.pathname = "/chat";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/upload/:path*"],
};
