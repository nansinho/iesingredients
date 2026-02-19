import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("hero");

  return (
    <div>
      {/* Hero Parallax - Phase 2 */}
      <section className="relative min-h-screen flex items-center justify-center bg-forest-950">
        <div className="container-luxe text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8">
            <span className="text-gold-500 text-sm font-medium tracking-luxury uppercase">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-white mb-6">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-forest-300 max-w-2xl mx-auto mb-10">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-luxury-primary rounded-lg">
              {t("cta")}
            </button>
            <button className="btn-luxury-outline text-white rounded-lg">
              {t("ctaSecondary")}
            </button>
          </div>
        </div>
      </section>

      {/* Other sections will be added in Phase 2 */}
    </div>
  );
}
