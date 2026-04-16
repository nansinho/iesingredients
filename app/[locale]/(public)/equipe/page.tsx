import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Users, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { TeamPageClient } from "@/components/team/TeamPageClient";
import { AnimateIn } from "@/components/ui/AnimateIn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description =
    locale === "fr"
      ? "Rencontrez l'équipe IES Ingredients : des experts passionnés en ingrédients naturels au service de votre réussite."
      : "Meet the IES Ingredients team: passionate natural ingredient experts dedicated to your success.";

  return {
    title: t("teamTitle"),
    description,
    alternates: {
      canonical: `/${locale}/equipe`,
      languages: { fr: "/fr/equipe", en: "/en/team" },
    },
    openGraph: {
      title: t("teamTitle"),
      description,
      url: `https://ies-ingredients.com/${locale}/${locale === "fr" ? "equipe" : "team"}`,
      type: "website",
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "IES Ingredients", url: `https://ies-ingredients.com/${locale}` },
          { name: isFr ? "Équipe" : "Team", url: `https://ies-ingredients.com/${locale}/${isFr ? "equipe" : "team"}` },
        ]}
      />

      {/* ═══ Hero — cinematic ═══ */}
      <section className="relative min-h-[70vh] bg-brand-primary overflow-hidden flex items-center pt-32 pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/botanicals-flat.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/85 to-brand-primary/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/50 via-transparent to-brand-primary" />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 75% 40%, hsl(var(--brand-accent) / 0.18) 0%, transparent 55%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto w-full">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-10">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
                {isFr ? "L'équipe" : "The team"}
              </span>
              <div className="h-px flex-1 max-w-[180px] bg-white/15" />
              <span className="text-[11px] font-mono text-white/30 hidden sm:inline">
                {(members?.length || 0)} {isFr ? "expert" : "expert"}{(members?.length || 0) > 1 ? "s" : ""}
              </span>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1} y={30}>
            <h1
              className="text-white font-semibold tracking-[-0.035em] leading-[0.98] mb-6"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 7rem)" }}
            >
              {isFr ? "Les experts" : "The experts"}
              <br />
              <span className="text-brand-accent">{isFr ? "derrière IES." : "behind IES."}</span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.2} y={20}>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed max-w-xl">
              {isFr
                ? "Une équipe passionnée, multiculturelle et engagée au service de vos projets en ingrédients naturels."
                : "A passionate, multicultural and committed team dedicated to your natural ingredient projects."}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ═══ Team directory ═══ */}
      <TeamPageClient
        members={(members || []).map((m: Record<string, unknown>) => ({
          id: m.id as string,
          name: m.name as string,
          role_fr: m.role_fr as string,
          role_en: (m.role_en as string) || null,
          email: (m.email as string) || null,
          phone: (m.phone as string) || null,
          linkedin_url: (m.linkedin_url as string) || null,
          photo_url: (m.photo_url as string) || null,
          bio_fr: (m.bio_fr as string) || null,
          bio_en: (m.bio_en as string) || null,
          department: (m.department as string) || null,
          display_order: (m.display_order as number) || null,
        }))}
        locale={locale}
      />

      {/* ═══ CTA — minimal ═══ */}
      <section className="py-20 md:py-24 bg-cream-light border-t border-dark/5">
        <div className="w-[94%] max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-dark/40 block mb-4">
              {isFr ? "Collaborer" : "Collaborate"}
            </span>
            <h2
              className="text-dark font-semibold tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              {isFr ? "Parlons de vos" : "Let's discuss your"}{" "}
              <span className="text-brand-accent">{isFr ? "besoins." : "needs."}</span>
            </h2>
          </div>
          <div className="md:text-right space-y-4">
            <p className="text-dark/55 text-base leading-relaxed">
              {isFr
                ? "Contactez notre équipe pour vos projets en ingrédients naturels, échantillons ou formulations."
                : "Contact our team for your natural ingredient projects, samples or formulations."}
            </p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-full px-7 py-3.5 text-sm font-semibold shadow-lg shadow-brand-accent/20 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>{isFr ? "Nous contacter" : "Contact us"}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 text-sm font-semibold text-dark/70 hover:text-dark transition-colors border-b border-dark/20 hover:border-dark/60 pb-1"
              >
                <span>{isFr ? "Explorer le catalogue" : "Explore the catalog"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
