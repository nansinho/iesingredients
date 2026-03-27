import { RegisterForm } from "@/components/auth/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const title = isFr ? "Inscription - IES Ingredients" : "Register - IES Ingredients";
  const description = isFr
    ? "Créez votre compte IES Ingredients pour commander des échantillons d'ingrédients naturels."
    : "Create your IES Ingredients account to order natural ingredient samples.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/register`,
      languages: { fr: "/fr/register", en: "/en/register" },
    },
    openGraph: {
      title,
      description,
      url: `https://ies-ingredients.com/${locale}/register`,
      type: "website",
    },
    robots: { index: false, follow: true },
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-[-0.03em] mb-2">
          {isFr ? "Créer un compte" : "Create Account"}
        </h1>
        <p className="text-white/50">
          {isFr
            ? "Rejoignez-nous pour commander des échantillons"
            : "Join us to order samples"}
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
