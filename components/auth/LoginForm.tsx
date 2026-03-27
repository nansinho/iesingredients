"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { SecurityCheck } from "@/components/security/SecurityCheck";
import { HoneypotFields } from "@/components/security/HoneypotFields";

export function LoginForm() {
  const locale = useLocale();
  const isFr = locale === "fr";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securityToken, setSecurityToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState({ website: "", faxNumber: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.website || honeypot.faxNumber) return;
    if (!securityToken) {
      toast.error(isFr ? "Veuillez compléter la vérification" : "Please complete the security check");
      return;
    }
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
    <div className="bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <form onSubmit={handleSubmit} className="relative space-y-5">
        <HoneypotFields values={honeypot} onChange={(f, v) => setHoneypot((prev) => ({ ...prev, [f]: v }))} />
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 px-4 bg-white/[0.08] border-0 text-white placeholder:text-white/30 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-white/80">
            {isFr ? "Mot de passe" : "Password"}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 pr-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 rounded-xl text-sm transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
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
          <Link href="/login" className="text-xs text-white/40 hover:text-white/70 transition-colors mt-1.5 inline-block">
            {isFr ? "Mot de passe oublié ?" : "Forgot password?"}
          </Link>
        </div>

        <SecurityCheck
          onVerified={setSecurityToken}
          onReset={() => setSecurityToken(null)}
          variant="dark"
        />

        <button
          type="submit"
          disabled={isLoading || !securityToken}
          className="w-full h-12 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold text-sm transition-all duration-300 shadow-md shadow-brand-accent/20 hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isFr ? "Connexion..." : "Signing in..."}
            </span>
          ) : (
            isFr ? "Se connecter" : "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-white/50">
          {isFr ? "Pas encore de compte ?" : "Don't have an account?"}{" "}
          <Link href="/register" className="text-brand-accent-light hover:text-white font-semibold transition-colors">
            {isFr ? "S'inscrire" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}
