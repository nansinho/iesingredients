"use client";

import { useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { ShieldCheck, Check, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ICON_COMPONENTS } from "@/lib/security/icons";
import { ICON_POOL } from "@/lib/security/constants";
import { IconGrid } from "./IconGrid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TOTAL_STEPS = 2;

interface ChallengeData {
  grid: string[];
  targetId: string;
  targetName: { fr: string; en: string };
  challengeToken: string;
}

type Status = "idle" | "loading" | "open" | "verifying" | "verified" | "error" | "cooldown";

interface SecurityCheckProps {
  onVerified: (securityToken: string) => void;
  onReset?: () => void;
  variant?: "light" | "dark";
  className?: string;
}

const labels = {
  fr: {
    checkbox: "Je ne suis pas un robot",
    verified: "Vérification réussie",
    title: "Vérification de sécurité",
    instruction: "Cliquez sur :",
    step: "Étape",
    of: "sur",
    loading: "Chargement...",
    error: "Mauvaise réponse, réessayez",
    cooldown: "Trop de tentatives, patientez...",
  },
  en: {
    checkbox: "I'm not a robot",
    verified: "Verification complete",
    title: "Security check",
    instruction: "Click on:",
    step: "Step",
    of: "of",
    loading: "Loading...",
    error: "Wrong answer, try again",
    cooldown: "Too many attempts, please wait...",
  },
};

export function SecurityCheck({
  onVerified,
  onReset,
  variant = "light",
  className,
}: SecurityCheckProps) {
  const locale = useLocale();
  const t = labels[locale === "fr" ? "fr" : "en"];
  const isDark = variant === "dark";

  const [status, setStatus] = useState<Status>("idle");
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [lastToken, setLastToken] = useState<string | null>(null);

  const fetchChallenge = useCallback(async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/security/challenge");
      const data = await res.json();
      setChallenge(data);
      setStatus("open");
    } catch {
      setStatus("idle");
    }
  }, []);

  const handleCheckboxClick = () => {
    if (status === "verified") return;
    setCurrentStep(1);
    setLastToken(null);
    fetchChallenge();
  };

  const handleRefresh = async () => {
    setErrorMsg("");
    await fetchChallenge();
  };

  const handleSelect = async (iconId: string) => {
    if (!challenge || status === "verifying") return;
    setStatus("verifying");

    try {
      const res = await fetch("/api/security/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeToken: challenge.challengeToken,
          selectedIconId: iconId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (currentStep < TOTAL_STEPS) {
          // Step passed — move to next step
          setLastToken(data.securityToken);
          setCurrentStep((prev) => prev + 1);
          await fetchChallenge();
        } else {
          // All steps passed — verified
          setStatus("verified");
          onVerified(data.securityToken);
        }
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setStatus("cooldown");
          setErrorMsg(t.cooldown);
          setTimeout(() => {
            setAttempts(0);
            setCurrentStep(1);
            setLastToken(null);
            setStatus("idle");
            setErrorMsg("");
          }, 600_000);
        } else {
          setStatus("error");
          setErrorMsg(t.error);
          setTimeout(() => fetchChallenge(), 1200);
        }
      }
    } catch {
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setChallenge(null);
    setAttempts(0);
    setErrorMsg("");
    setCurrentStep(1);
    setLastToken(null);
    onReset?.();
  };

  const TargetIcon = challenge ? ICON_COMPONENTS[challenge.targetId] : null;
  const targetLabel = challenge
    ? locale === "fr"
      ? ICON_POOL.find((i) => i.id === challenge.targetId)?.fr
      : ICON_POOL.find((i) => i.id === challenge.targetId)?.en
    : "";

  return (
    <>
      {/* Checkbox row */}
      <div
        className={cn(
          "flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 border",
          isDark
            ? "bg-white/[0.06] border-white/15"
            : "bg-cream-light/50 border-brand-primary/10",
          status === "verified" && (isDark ? "border-green-400/30 bg-green-400/[0.08]" : "border-green-500/30 bg-green-50"),
          className
        )}
      >
        <button
          type="button"
          onClick={handleCheckboxClick}
          disabled={status === "verified" || status === "loading" || status === "cooldown"}
          className="flex items-center gap-3 flex-1"
        >
          <div
            className={cn(
              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300",
              status === "verified"
                ? "bg-green-500 border-green-500"
                : status === "loading"
                  ? isDark ? "border-white/30" : "border-brand-primary/20"
                  : isDark
                    ? "border-white/30 hover:border-white/50"
                    : "border-brand-primary/25 hover:border-brand-primary/40"
            )}
          >
            {status === "verified" && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
            )}
            {status === "loading" && (
              <Loader2 className={cn("w-3.5 h-3.5 animate-spin", isDark ? "text-white/50" : "text-brand-primary/40")} />
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              status === "verified"
                ? "text-green-600 dark:text-green-400"
                : isDark
                  ? "text-white/70"
                  : "text-brand-primary/70"
            )}
          >
            {status === "verified" ? t.verified : status === "cooldown" ? t.cooldown : t.checkbox}
          </span>
        </button>

        <ShieldCheck
          className={cn(
            "w-5 h-5 shrink-0",
            status === "verified"
              ? "text-green-500"
              : isDark
                ? "text-white/20"
                : "text-brand-primary/15"
          )}
        />
      </div>

      {/* CAPTCHA Modal */}
      <Dialog
        open={status === "open" || status === "verifying" || status === "error"}
        onOpenChange={(open) => {
          if (!open) handleReset();
        }}
      >
        <DialogContent className="sm:max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold text-brand-primary">
              {t.title}
            </DialogTitle>
          </DialogHeader>

          {challenge && (
            <div className="space-y-4 mt-2">
              {/* Step indicator */}
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        i + 1 < currentStep
                          ? "bg-green-500"
                          : i + 1 === currentStep
                            ? "bg-brand-accent"
                            : "bg-brand-primary/15"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-brand-primary/40">
                {t.step} {currentStep} {t.of} {TOTAL_STEPS}
              </p>

              {/* Instruction */}
              <div className="flex items-center justify-center gap-3 bg-brand-primary/[0.04] rounded-xl px-4 py-3">
                {TargetIcon && (
                  <div className="w-9 h-9 rounded-full bg-brand-accent/15 flex items-center justify-center">
                    <TargetIcon className="w-5 h-5 text-brand-accent" strokeWidth={2} />
                  </div>
                )}
                <span className="text-sm font-medium text-brand-primary">
                  {t.instruction}{" "}
                  <span className="text-brand-accent font-semibold">{targetLabel}</span>
                </span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={status === "verifying"}
                  className="ml-auto text-brand-primary/30 hover:text-brand-primary/60 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {errorMsg && status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm text-red-500 font-medium"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Icon grid */}
              <IconGrid
                grid={challenge.grid}
                onSelect={handleSelect}
                disabled={status === "verifying"}
              />

              {status === "verifying" && (
                <div className="flex justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-accent" />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
