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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any;
  const adminProfile = {
    id: p?.id || "",
    full_name: (p?.full_name as string) || null,
    email: (p?.email as string) || null,
    company: (p?.company as string) || null,
    phone: (p?.phone as string) || null,
    avatar_url: (p?.avatar_url as string) || null,
    linkedin_url: (p?.linkedin_url as string) || null,
    instagram_url: (p?.instagram_url as string) || null,
    twitter_url: (p?.twitter_url as string) || null,
    website_url: (p?.website_url as string) || null,
    siret: (p?.siret as string) || null,
    tva_intracom: (p?.tva_intracom as string) || null,
    billing_address: (p?.billing_address as string) || null,
    billing_city: (p?.billing_city as string) || null,
    billing_postal_code: (p?.billing_postal_code as string) || null,
    billing_country: (p?.billing_country as string) || null,
    shipping_address: (p?.shipping_address as string) || null,
    shipping_city: (p?.shipping_city as string) || null,
    shipping_postal_code: (p?.shipping_postal_code as string) || null,
    shipping_country: (p?.shipping_country as string) || null,
    shipping_same_as_billing: p?.shipping_same_as_billing !== false,
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
