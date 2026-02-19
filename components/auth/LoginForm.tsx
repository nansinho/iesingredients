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
      router.push("/" as any);
      router.refresh();
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
          <Label htmlFor="email" className="text-cream-200">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-cream-200">
            {isFr ? "Mot de passe" : "Password"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-forest-900 font-medium rounded-full"
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
        <p className="text-cream-400">
          {isFr ? "Pas encore de compte ?" : "Don't have an account?"}{" "}
          <Link href="/register" className="text-gold-400 hover:text-gold-300 font-medium">
            {isFr ? "S'inscrire" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}
