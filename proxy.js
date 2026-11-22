import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic gate: no session cookie -> Sign In (with a ?redirect back).
 * The real checks (valid session, role, blocked) run on the server in the dashboard layouts
 * and in the Express API. Because this only looks at the cookie, a reload on a private route
 * never bounces a logged-in user to the login page.
 */
export function proxy(request) {
  if (!getSessionCookie(request)) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/menu/:id+", "/payment/:path*", "/onboarding"] };
