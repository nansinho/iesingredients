"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { SPECIAL_CHAR_REGEX } from "@/lib/validations";

export function ChangePasswordForm() {
  const locale = useLocale();
  const isFr = locale === "fr";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

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
      toast.error(isFr ? "Mot de passe invalide" : "Invalid password", { description: passwordError });
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error(isFr ? "Les mots de passe ne correspondent pas" : "Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Update password
      const { error } = await supabase.auth.updateUser({ password: form.password });
      if (error) throw error;

      // Mark password as changed
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("profiles") as any)
          .update({ must_change_password: false })
          .eq("id", user.id);
      }

      toast.success(isFr ? "Mot de passe mis à jour !" : "Password updated!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push("/admin" as any);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : (isFr ? "Erreur" : "Error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-center mb-6">
        <div className="w-14 h-14 rounded-full bg-brand-accent/20 flex items-center justify-center">
          <Lock className="w-7 h-7 text-brand-accent" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/80">
            {isFr ? "Nouveau mot de passe" : "New password"} *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
              className="h-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 pr-12 rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            required
            className="h-12 bg-white/[0.08] border-0 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 focus:outline-none focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="accent"
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              {isFr ? "Mise à jour..." : "Updating..."}
            </>
          ) : (
            isFr ? "Valider le nouveau mot de passe" : "Set new password"
          )}
        </Button>
      </form>
    </div>
  );
}
