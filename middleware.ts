import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

// Routes requiring an active Supabase session refresh in the middleware.
// Everything else runs purely through next-intl so that ISR/CDN caching works.
const AUTH_PATH_PATTERN =
  /^\/(?:fr|en)\/(?:admin|mon-compte|my-account|login|register)(?:\/|$)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuthRefresh = AUTH_PATH_PATTERN.test(pathname);

  if (needsAuthRefresh) {
    const supabaseResponse = await updateSession(request);
    const intlResponse = intlMiddleware(request);

    if (intlResponse) {
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value);
      });
      return intlResponse;
    }

    return supabaseResponse;
  }

  const intlResponse = intlMiddleware(request);
  return intlResponse ?? NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except static files, api routes, and _next
    "/((?!api|_next/static|_next/image|favicon.ico|images|videos|.*\\..*).*)",
  ],
};
