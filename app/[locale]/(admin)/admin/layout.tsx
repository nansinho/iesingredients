import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { requireAuth, isAdmin, getProfile } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAuth(locale);
  const admin = await isAdmin();
  if (!admin) redirect(`/${locale}`);

  const [messages, profile] = await Promise.all([getMessages(), getProfile()]);

  const adminProfile = {
    id: profile?.id || "",
    full_name: profile?.full_name || null,
    email: profile?.email || null,
    company: profile?.company || null,
    phone: profile?.phone || null,
    avatar_url: (profile as Record<string, unknown>)?.avatar_url as string | null ?? null,
    linkedin_url: (profile as Record<string, unknown>)?.linkedin_url as string | null ?? null,
    instagram_url: (profile as Record<string, unknown>)?.instagram_url as string | null ?? null,
    twitter_url: (profile as Record<string, unknown>)?.twitter_url as string | null ?? null,
    website_url: (profile as Record<string, unknown>)?.website_url as string | null ?? null,
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen bg-[#F8F7F5]">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
          <AdminHeader profile={adminProfile} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
