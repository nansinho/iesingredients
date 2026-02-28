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
    <div className="bg-white dark:bg-dark-card border border-dark/8 dark:border-dark/10 rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-dark dark:text-cream-light">
            {isFr ? "Nom complet" : "Full name"} *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="h-12 bg-cream-light dark:bg-dark border-dark/10 dark:border-dark/10 text-dark dark:text-cream-light placeholder:text-dark/30 dark:placeholder:text-cream-light/30 rounded-xl transition-all duration-300 focus:border-olive/30 focus:shadow-[0_0_0_3px_rgba(46,31,61,0.1)]"
            placeholder="Jean Dupont"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-dark dark:text-cream-light">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="h-12 bg-cream-light dark:bg-dark border-dark/10 dark:border-dark/10 text-dark dark:text-cream-light placeholder:text-dark/30 dark:placeholder:text-cream-light/30 rounded-xl transition-all duration-300 focus:border-olive/30 focus:shadow-[0_0_0_3px_rgba(46,31,61,0.1)]"
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-dark dark:text-cream-light">
            {isFr ? "Entreprise" : "Company"}
          </Label>
          <Input
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="h-12 bg-cream-light dark:bg-dark border-dark/10 dark:border-dark/10 text-dark dark:text-cream-light placeholder:text-dark/30 dark:placeholder:text-cream-light/30 rounded-xl transition-all duration-300 focus:border-olive/30 focus:shadow-[0_0_0_3px_rgba(46,31,61,0.1)]"
            placeholder={isFr ? "Votre entreprise" : "Your company"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-dark dark:text-cream-light">
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
              className="h-12 bg-cream-light dark:bg-dark border-brown/15 dark:border-brown/10 text-dark dark:text-cream-light placeholder:text-dark/30 dark:placeholder:text-cream-light/30 pr-12 rounded-xl transition-all duration-300 focus:border-brown/30 focus:shadow-[0_0_0_3px_rgba(200,168,168,0.15)]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? (isFr ? "Masquer le mot de passe" : "Hide password") : (isFr ? "Afficher le mot de passe" : "Show password")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 dark:text-cream-light/40 hover:text-dark/70 dark:hover:text-cream-light/70 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <PasswordStrengthIndicator password={form.password} isFr={isFr} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-dark dark:text-cream-light">
            {isFr ? "Confirmer le mot de passe" : "Confirm password"} *
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="h-12 bg-cream-light dark:bg-dark border-dark/10 dark:border-dark/10 text-dark dark:text-cream-light placeholder:text-dark/30 dark:placeholder:text-cream-light/30 rounded-xl transition-all duration-300 focus:border-olive/30 focus:shadow-[0_0_0_3px_rgba(46,31,61,0.1)]"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="peach"
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
        <p className="text-dark/50 dark:text-cream-light/50">
          {isFr ? "Déjà un compte ?" : "Already have an account?"}{" "}
          <Link href="/login" className="text-olive hover:text-olive-dark font-medium transition-colors">
            {isFr ? "Se connecter" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
