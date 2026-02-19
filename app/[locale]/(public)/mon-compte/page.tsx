import { redirect } from "next/navigation";
import { getUser, getUserRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AccountClient } from "@/components/account/AccountClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Mon Compte - IES Ingredients" : "My Account - IES Ingredients",
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

  const requests = (rawRequests || []) as any[];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Mon Compte" : "My Account", url: `https://ies-ingredients.com/${locale}/${isFr ? "mon-compte" : "my-account"}` },
        ]}
      />

      <section className="bg-forest-950 pt-28 sm:pt-32 pb-16">
        <div className="container-luxe">
          <span className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block">
            {isFr ? "Espace client" : "Client space"}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">
            {isFr ? "Mon Compte" : "My Account"}
          </h1>
          <p className="text-cream-300">
            {user.email}
            {role === "admin" && (
              <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-gold-500/20 text-gold-400">
                Admin
              </span>
            )}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <AccountClient
            profile={profile}
            requests={requests}
            userEmail={user.email || ""}
          />
        </div>
      </section>
    </>
  );
}
