import { RegisterForm } from "@/components/auth/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Inscription - IES Ingredients" : "Register - IES Ingredients",
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
        <h1 className="font-serif text-3xl text-white mb-2">
          {isFr ? "Créer un compte" : "Create Account"}
        </h1>
        <p className="text-cream-300">
          {isFr
            ? "Rejoignez-nous pour commander des échantillons"
            : "Join us to order samples"}
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
