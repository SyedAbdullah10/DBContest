// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   // Define protected paths and their required roles
//   const protectedRoutes = {
//     "/user/dashboard": "user",
//     "/admin/dashboard": "admin"
//   };

//   // Check if the current path is protected
//   if (Object.keys(protectedRoutes).some(path => pathname.startsWith(path))) {
//     // If no token exists, redirect to appropriate login page
//     if (!token) {
//       if (pathname.startsWith("/admin")) {
//         return NextResponse.redirect(new URL("/admin", req.url));
//       }
//       return NextResponse.redirect(new URL("/user", req.url));
//     }

//     // Check if user has the correct role for the path
//     const requiredRole = pathname.startsWith("/admin") ? "admin" : "user";
//     if (token.role !== requiredRole) {
//       // Redirect to appropriate login page based on attempted access
//       if (pathname.startsWith("/admin")) {
//         return NextResponse.redirect(new URL("/admin", req.url));
//       }
//       return NextResponse.redirect(new URL("/user", req.url));
//     }
//   }

//   // Allow access to login pages
//   if (pathname === "/admin" || pathname === "/user") {
//     if (token) {
//       // If already logged in, redirect to appropriate dashboard
//       if (token.role === "admin") {
//         return NextResponse.redirect(new URL("/admin/dashboard", req.url));
//       }
//       if (token.role === "user") {
//         return NextResponse.redirect(new URL("/user/dashboard", req.url));
//       }
//     }
//   }

//   return NextResponse.next();
// }

// // Apply middleware to specific routes
// export const config = {
//   matcher: [
//     "/user",
//     "/user/dashboard",
//     "/admin",
//     "/admin/dashboard",
//     // Add any other routes that need protection
//   ]
// };

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Role-based access map
  const apiAccess = [
    { path: /^\/api\/contest-info\/[^\/]+$/, roles: ["user", "admin"] },
    { path: /^\/api\/contest-info\/[^\/]+\/ddl$/, roles: ["admin"] },
    { path: /^\/api\/contest-info\/[^\/]+\/question\/[^\/]+$/, roles: ["admin"] },
    { path: /^\/api\/contest-info\/[^\/]+\/update-timer$/, roles: ["admin"] },
    { path: /^\/api\/createContest$/, roles: ["admin"] },
    { path: /^\/api\/dashboard-contests$/, roles: ["user", "admin"] },
    { path: /^\/api\/evaluate$/, roles: ["user", "admin"] },
    { path: /^\/api\/execute$/, roles: ["user", "admin"] },
    { path: /^\/api\/get-questions$/, roles: ["user", "admin"] },
    { path: /^\/api\/get-submissions$/, roles: ["user", "admin"] },
    { path: /^\/api\/get-leaderboard\/[^\/]+$/, roles: ["user", "admin"] },
    { path: /^\/api\/get-submission\/[^\/]+$/, roles: ["user", "admin"] },
    { path: /^\/api\/user-CRUD$/, roles: ["admin"] },
  ];

  // Check API access
  const matchedApi = apiAccess.find(route => route.path.test(pathname));
  if (matchedApi) {
    if (!token || !matchedApi.roles.includes(token.role)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
  }

  // Page-based route protection
  if (pathname === "/admin" || pathname === "/user") {
    if (token) {
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      if (token.role === "user") {
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
      }
    }
  }

  if (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/user/dashboard")) {
    if (!token || (pathname.startsWith("/admin") && token.role !== "admin") || (pathname.startsWith("/user") && token.role !== "user")) {
      const redirectTo = pathname.startsWith("/admin") ? "/admin" : "/user";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard",
    "/user",
    "/user/dashboard",
    "/api/:path*"
  ]
};
