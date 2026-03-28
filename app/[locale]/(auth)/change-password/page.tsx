import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

export default async function ChangePasswordPage({
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
          {isFr ? "Changement de mot de passe" : "Change Password"}
        </h1>
        <p className="text-white/50">
          {isFr
            ? "Veuillez choisir un nouveau mot de passe pour continuer"
            : "Please choose a new password to continue"}
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
