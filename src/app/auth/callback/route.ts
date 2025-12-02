import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, defaultLocale } from "@/src/config-locale";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const cookieStore = await cookies();
      const locale = cookieStore.get(COOKIE_NAME)?.value || defaultLocale;

      const redirectPath = redirectTo.startsWith(`/${locale}`)
        ? redirectTo
        : redirectTo.startsWith("/")
          ? `/${locale}${redirectTo}`
          : `/${locale}/admin`;

      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME)?.value || defaultLocale;
  return NextResponse.redirect(`${origin}/${locale}/login`);
}
