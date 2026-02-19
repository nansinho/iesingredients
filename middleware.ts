import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Handle Supabase session refresh
  const supabaseResponse = await updateSession(request);

  // 2. Handle internationalization routing
  const intlResponse = intlMiddleware(request);

  // Merge supabase cookies into the intl response
  if (intlResponse) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
    return intlResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except static files, api routes, and _next
    "/((?!api|_next/static|_next/image|favicon.ico|images|videos|.*\\..*).*)",
  ],
};
