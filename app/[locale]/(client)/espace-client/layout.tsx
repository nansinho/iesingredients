import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { requireAuth, getProfile } from "@/lib/auth";
import { ClientShell } from "@/components/client/ClientShell";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await requireAuth(locale);
  if (!user) redirect(`/${locale}/login`);

  const [messages, profile] = await Promise.all([getMessages(), getProfile()]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any;
  const clientProfile = {
    id: p?.id || "",
    full_name: (p?.full_name as string) || null,
    email: (p?.email as string) || null,
    company: (p?.company as string) || null,
    phone: (p?.phone as string) || null,
    avatar_url: (p?.avatar_url as string) || null,
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <ClientShell profile={clientProfile}>
        {children}
      </ClientShell>
    </NextIntlClientProvider>
  );
}
