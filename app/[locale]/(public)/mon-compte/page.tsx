import { redirect } from "next/navigation";
import { getUser, getUserRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { User } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AccountClient } from "@/components/account/AccountClient";
import { AnimateIn } from "@/components/ui/AnimateIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const title = isFr ? "Mon Compte - IES Ingredients" : "My Account - IES Ingredients";
  const description = isFr
    ? "Gérez votre compte IES Ingredients : profil, historique de commandes d'échantillons et préférences."
    : "Manage your IES Ingredients account: profile, sample order history and preferences.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${isFr ? "mon-compte" : "my-account"}`,
      languages: { fr: "/fr/mon-compte", en: "/en/my-account" },
    },
    openGraph: {
      title,
      description,
      url: `https://ies-ingredients.com/${locale}/${isFr ? "mon-compte" : "my-account"}`,
      type: "website",
    },
    robots: { index: false, follow: true },
  };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Fetch user role
  const role = await getUserRole();

  // Fetch sample requests with items
  const { data: rawRequests } = await supabase
    .from("sample_requests")
    .select("*, sample_request_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requests = (rawRequests || []) as any[];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Mon Compte" : "My Account", url: `https://ies-ingredients.com/${locale}/${isFr ? "mon-compte" : "my-account"}` },
        ]}
      />

      <section className="bg-dark pt-32 sm:pt-36 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

        <div className="w-[94%] mx-auto relative z-10">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/10 border border-peach/20 text-peach text-xs font-semibold uppercase tracking-[0.15em] mb-5">
              <User className="w-3.5 h-3.5" />
              {isFr ? "Espace client" : "Client space"}
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-cream-light tracking-[-0.03em] leading-[1.05] mb-6">
              {isFr ? "Mon" : "My"}{" "}
              <span className="font-playfair italic text-peach">{isFr ? "Compte" : "Account"}</span>
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-cream-light/50 text-lg max-w-2xl">
              {user.email}
              {role === "admin" && (
                <span className="ml-3 px-2.5 py-1 rounded-full text-xs font-medium bg-peach/10 border border-peach/20 text-peach">
                  Admin
                </span>
              )}
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white dark:bg-dark">
        <AnimateIn delay={0.15} y={30} className="max-w-[900px] w-[90%] mx-auto">
          <AccountClient
            profile={profile}
            requests={requests}
            userEmail={user.email || ""}
          />
        </AnimateIn>
      </section>
    </>
  );
}
