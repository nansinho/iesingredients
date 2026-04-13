import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { requireAuth } from "@/lib/auth";
import { ClientShell } from "@/components/client/ClientShell";
import { getEffectiveProfile } from "@/lib/impersonate";
import { ImpersonateBanner } from "@/components/admin/ImpersonateBanner";

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

  const [messages, effectiveProfile] = await Promise.all([
    getMessages(),
    getEffectiveProfile(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = effectiveProfile as any;
  const impersonating = p?.impersonating === true;

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
      {impersonating && (
        <ImpersonateBanner
          userName={clientProfile.full_name || "Utilisateur"}
          userEmail={clientProfile.email || ""}
          userCompany={clientProfile.company}
        />
      )}
      <ClientShell profile={clientProfile} impersonating={impersonating}>
        {children}
      </ClientShell>
    </NextIntlClientProvider>
  );
}
