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

export function RegisterForm() {
  const locale = useLocale();
  const isFr = locale === "fr";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-cream-200">
            {isFr ? "Nom complet" : "Full name"} *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            placeholder="Jean Dupont"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-cream-200">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-cream-200">
            {isFr ? "Entreprise" : "Company"}
          </Label>
          <Input
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            placeholder={isFr ? "Votre entreprise" : "Your company"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-cream-200">
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
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? (isFr ? "Masquer le mot de passe" : "Hide password") : (isFr ? "Afficher le mot de passe" : "Show password")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <PasswordStrengthIndicator password={form.password} isFr={isFr} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-cream-200">
            {isFr ? "Confirmer le mot de passe" : "Confirm password"} *
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-forest-900 font-medium rounded-full"
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
        <p className="text-cream-400">
          {isFr ? "Déjà un compte ?" : "Already have an account?"}{" "}
          <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium">
            {isFr ? "Se connecter" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
