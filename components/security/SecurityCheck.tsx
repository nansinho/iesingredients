"use client";

import { useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { ShieldCheck, Check, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ICON_COMPONENTS } from "@/lib/security/icons";
import { ICON_POOL } from "@/lib/security/constants";
import { IconGrid } from "./IconGrid";

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
    if (status === "verified" || status === "cooldown") return;
    // Toggle : fermer si déjà ouvert
    if (status === "open" || status === "verifying" || status === "error") {
      handleReset();
      return;
    }
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
          setLastToken(data.securityToken);
          setCurrentStep((prev) => prev + 1);
          await fetchChallenge();
        } else {
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

  const isExpanded = status === "open" || status === "verifying" || status === "error";

  return (
    <div className={cn("space-y-0", className)}>
      {/* Checkbox row */}
      <div
        className={cn(
          "flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 border",
          isDark
            ? "bg-white/[0.06] border-white/15"
            : "bg-cream-light/50 border-brand-primary/10",
          status === "verified" && (isDark ? "border-green-400/30 bg-green-400/[0.08]" : "border-green-500/30 bg-green-50"),
          isExpanded && (isDark ? "border-white/25" : "border-brand-accent/25")
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
                ? "text-green-600"
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
            "w-5 h-5 shrink-0 transition-colors duration-300",
            status === "verified"
              ? "text-green-500"
              : isExpanded
                ? isDark ? "text-white/40" : "text-brand-accent/50"
                : isDark
                  ? "text-white/20"
                  : "text-brand-primary/15"
          )}
        />
      </div>

      {/* Inline challenge panel */}
      <AnimatePresence>
        {isExpanded && challenge && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "mt-2 rounded-xl border p-4 space-y-4",
                isDark
                  ? "bg-white/[0.04] border-white/10"
                  : "bg-white/60 border-brand-primary/8 shadow-sm"
              )}
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        i + 1 < currentStep
                          ? "bg-green-500"
                          : i + 1 === currentStep
                            ? "bg-brand-accent w-5"
                            : isDark ? "bg-white/15" : "bg-brand-primary/12"
                      )}
                    />
                  ))}
                </div>
                <p className={cn(
                  "text-[11px] font-medium tracking-wide uppercase",
                  isDark ? "text-white/30" : "text-brand-primary/35"
                )}>
                  {t.step} {currentStep} {t.of} {TOTAL_STEPS}
                </p>
              </div>

              {/* Instruction */}
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5",
                  isDark
                    ? "bg-white/[0.06]"
                    : "bg-brand-primary/[0.03]"
                )}
              >
                {TargetIcon && (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      isDark
                        ? "bg-brand-accent/20"
                        : "bg-brand-accent/10"
                    )}
                  >
                    <TargetIcon className="w-4.5 h-4.5 text-brand-accent" strokeWidth={2} />
                  </div>
                )}
                <span className={cn(
                  "text-sm font-medium flex-1",
                  isDark ? "text-white/70" : "text-brand-primary/70"
                )}>
                  {t.instruction}{" "}
                  <span className="text-brand-accent font-semibold">{targetLabel}</span>
                </span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={status === "verifying"}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isDark
                      ? "text-white/25 hover:text-white/50 hover:bg-white/[0.06]"
                      : "text-brand-primary/25 hover:text-brand-primary/50 hover:bg-brand-primary/[0.04]"
                  )}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {errorMsg && status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex items-center justify-center gap-2 text-sm font-medium rounded-lg px-3 py-2",
                      isDark
                        ? "text-red-400 bg-red-400/10"
                        : "text-red-500 bg-red-50"
                    )}
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon grid */}
              <IconGrid
                grid={challenge.grid}
                onSelect={handleSelect}
                disabled={status === "verifying"}
                variant={variant}
              />

              {status === "verifying" && (
                <div className="flex justify-center py-1">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
