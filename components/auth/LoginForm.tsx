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

export function LoginForm() {
  const locale = useLocale();
  const isFr = locale === "fr";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(isFr ? "Erreur de connexion" : "Login error", {
          description: error.message,
        });
        return;
      }

      toast.success(isFr ? "Connexion réussie" : "Login successful");

      // Check if user is admin to redirect to admin dashboard
      const { data: { user: loggedUser } } = await supabase.auth.getUser();
      let redirectPath = "/";
      if (loggedUser) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: roleData } = await (supabase.from("user_roles") as any)
          .select("role")
          .eq("user_id", loggedUser.id)
          .eq("role", "admin")
          .maybeSingle();
        if (roleData) redirectPath = "/admin";
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(redirectPath as any);
      router.refresh();
    } catch {
      toast.error(isFr ? "Une erreur est survenue" : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-brown/8 dark:border-brown/10 rounded-2xl p-8 shadow-[0_4px_30px_rgba(163,123,104,0.06)]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-dark dark:text-cream-light">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-cream-light dark:bg-dark border-brown/15 dark:border-brown/10 text-dark dark:text-cream-light placeholder:text-dark/30 dark:placeholder:text-cream-light/30 rounded-xl transition-all duration-300 focus:border-brown/30 focus:shadow-[0_0_0_3px_rgba(254,190,152,0.15)]"
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-dark dark:text-cream-light">
            {isFr ? "Mot de passe" : "Password"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-cream-light dark:bg-dark border-brown/15 dark:border-brown/10 text-dark dark:text-cream-light placeholder:text-dark/30 dark:placeholder:text-cream-light/30 pr-12 rounded-xl transition-all duration-300 focus:border-brown/30 focus:shadow-[0_0_0_3px_rgba(254,190,152,0.15)]"
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
              {isFr ? "Connexion..." : "Signing in..."}
            </>
          ) : (
            isFr ? "Se connecter" : "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-dark/50 dark:text-cream-light/50">
          {isFr ? "Pas encore de compte ?" : "Don't have an account?"}{" "}
          <Link href="/register" className="text-brown dark:text-peach hover:text-brown-dark dark:hover:text-peach-light font-medium transition-colors">
            {isFr ? "S'inscrire" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}
