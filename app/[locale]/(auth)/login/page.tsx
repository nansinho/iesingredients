import { LoginForm } from "@/components/auth/LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";
  const title = isFr ? "Connexion - IES Ingredients" : "Login - IES Ingredients";
  const description = isFr
    ? "Connectez-vous à votre espace client IES Ingredients pour gérer vos commandes d'échantillons."
    : "Sign in to your IES Ingredients client space to manage your sample orders.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/login`,
      languages: { fr: "/fr/login", en: "/en/login" },
    },
    openGraph: {
      title,
      description,
      url: `https://ies-ingredients.com/${locale}/login`,
      type: "website",
    },
    robots: { index: false, follow: true },
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
          {isFr ? "Connexion" : "Sign In"}
        </h1>
        <p className="text-cream-300">
          {isFr
            ? "Accédez à votre espace client"
            : "Access your client space"}
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
