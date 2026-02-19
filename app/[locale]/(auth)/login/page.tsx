import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: locale === "fr" ? "Connexion - IES Ingredients" : "Login - IES Ingredients",
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
        <h1 className="font-serif text-3xl text-white mb-2">
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
