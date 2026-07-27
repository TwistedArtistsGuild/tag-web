import { NextResponse } from "next/server";

export default function (request) {
  const token = request.cookies.get("__Secure-next-auth.session-token")?.value
    || request.cookies.get("next-auth.session-token")?.value;

  if (token && request.nextUrl.pathname.startsWith("/api/") && !request.nextUrl.pathname.startsWith("/api/auth")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", "Bearer " + token);
    requestHeaders.set("Cookie", "next-auth.session-token=" + token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};