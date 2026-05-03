import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req?.nextauth?.token as any;
    const path = req?.nextUrl?.pathname ?? "";

    // Admin routes protection
    if (path?.startsWith?.("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req?.nextUrl?.pathname ?? "";
        // Public routes
        if (
          path === "/" ||
          path === "/menu" ||
          path === "/login" ||
          path === "/signup" ||
          path?.startsWith?.("/api/auth") ||
          path === "/api/signup" ||
          path?.startsWith?.("/api/menu") ||
          path?.startsWith?.("/api/categories") ||
          path?.startsWith?.("/menu/") ||
          path?.startsWith?.("/\_next") ||
          path?.match?.(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|menu/).*)"],
};
