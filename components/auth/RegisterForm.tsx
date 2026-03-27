"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { SPECIAL_CHAR_REGEX } from "@/lib/validations";
import { SecurityCheck } from "@/components/security/SecurityCheck";
import { HoneypotFields } from "@/components/security/HoneypotFields";

export function RegisterForm() {
  const locale = useLocale();
  const isFr = locale === "fr";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [securityToken, setSecurityToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState({ website: "", faxNumber: "" });
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return isFr ? "Minimum 8 caractères" : "Minimum 8 characters";
    if (!/[A-Z]/.test(password)) return isFr ? "Au moins une majuscule" : "At least one uppercase";
    if (!/[0-9]/.test(password)) return isFr ? "Au moins un chiffre" : "At least one digit";
    if (!SPECIAL_CHAR_REGEX.test(password)) return isFr ? "Au moins un caractère spécial" : "At least one special character";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.website || honeypot.faxNumber) return;
    if (!securityToken) {
      toast.error(isFr ? "Veuillez compléter la vérification" : "Please complete the security check");
      return;
    }
    setIsLoading(true);

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      toast.error(isFr ? "Mot de passe invalide" : "Invalid password", {
        description: passwordError,
      });
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error(
        isFr ? "Les mots de passe ne correspondent pas" : "Passwords don't match"
      );
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            company: form.company || null,
          },
        },
      });

      if (error) {
        toast.error(isFr ? "Erreur d'inscription" : "Registration error", {
          description: error.message,
        });
        return;
      }

      toast.success(
        isFr ? "Compte créé avec succès !" : "Account created successfully!",
        {
          description: isFr
            ? "Vérifiez votre email pour confirmer votre compte."
            : "Check your email to confirm your account.",
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push("/login" as any);
    } catch {
      toast.error(isFr ? "Une erreur est survenue" : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <form onSubmit={handleSubmit} className="relative space-y-5">
        <HoneypotFields values={honeypot} onChange={(f, v) => setHoneypot((prev) => ({ ...prev, [f]: v }))} />
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white/80">
            {isFr ? "Nom complet" : "Full name"} *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="h-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
            placeholder="Jean Dupont"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/80">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="h-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-white/80">
            {isFr ? "Entreprise" : "Company"}
          </Label>
          <Input
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="h-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
            placeholder={isFr ? "Votre entreprise" : "Your company"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/80">
            {isFr ? "Mot de passe" : "Password"} *
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              className="h-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 pr-12 rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? (isFr ? "Masquer le mot de passe" : "Hide password") : (isFr ? "Afficher le mot de passe" : "Show password")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <PasswordStrengthIndicator password={form.password} isFr={isFr} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white/80">
            {isFr ? "Confirmer le mot de passe" : "Confirm password"} *
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="h-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
            placeholder="••••••••"
          />
        </div>

        <SecurityCheck
          onVerified={setSecurityToken}
          onReset={() => setSecurityToken(null)}
          variant="dark"
        />

        <Button
          type="submit"
          disabled={isLoading || !securityToken}
          variant="accent"
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              {isFr ? "Inscription..." : "Registering..."}
            </>
          ) : (
            isFr ? "Créer mon compte" : "Create Account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-white/50">
          {isFr ? "Déjà un compte ?" : "Already have an account?"}{" "}
          <Link href="/login" className="text-brand-accent-light hover:text-white font-semibold transition-colors">
            {isFr ? "Se connecter" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
