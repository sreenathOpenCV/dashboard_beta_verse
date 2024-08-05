// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(request: NextRequestWithAuth) {
    const role = request.nextauth.token?.role;

    // Check for access to /register
    if (request.nextUrl.pathname.startsWith("/register")) {
      if (role === "SUPER_ADMIN") {
        return NextResponse.next();
      } else {
        return NextResponse.rewrite(new URL("/denied", request.url));
      }
    }

    // Check for access to /manage_user and /manage_user_sheets
    if (
      (request.nextUrl.pathname.startsWith("/lead_managemen/manage_user") ||
        request.nextUrl.pathname.startsWith("/lead_managemen/manage_user_sheets")) &&
      (role === "OPERATIONS" || role === "SALES_MANAGER")
    ) {
      return NextResponse.next();
    }

    // Check for access to /utm_tracker
    if (
      request.nextUrl.pathname.startsWith("/analysis/utm_tracker") &&
      (role === "SUPER_ADMIN" || role === "ADMIN" || role === "MARKETING")
    ) {
      return NextResponse.next();
    }

    // General access check for other roles
    if (
      role === "SUPER_ADMIN" ||
      role === "ADMIN" ||
      role === "MARKETING"
    ) {
      return NextResponse.next();
    }

    // If none of the above conditions match, rewrite to /denied
    return NextResponse.rewrite(new URL("/denied", request.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/lead_management/manage_user",
    "/lead_management/manage_user_sheets",
    "/analysis//utm_tracker",
    "/analysis/source_tracker",
    "/profile",
    "/",
    "/call_audit",
    "/register",
    "/messages/sales_campaign",
    "/messages/webinar_notifications",
    "/webinar_attendees"
  ],
};
