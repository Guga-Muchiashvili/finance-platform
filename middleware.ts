import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken");
  const url = req.nextUrl;

  if (!authToken && url.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (authToken && url.pathname === "/") {
    return NextResponse.redirect(new URL("/Dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",
};
