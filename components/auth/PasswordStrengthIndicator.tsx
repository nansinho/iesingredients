"use client";

import { Check, X } from "lucide-react";
import { SPECIAL_CHAR_REGEX } from "@/lib/validations";

interface PasswordStrengthIndicatorProps {
  password: string;
  isFr: boolean;
}

export function PasswordStrengthIndicator({ password, isFr }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const criteria = [
    {
      met: password.length >= 8,
      labelFr: "8 caractères minimum",
      labelEn: "8 characters minimum",
    },
    {
      met: /[A-Z]/.test(password),
      labelFr: "Une lettre majuscule",
      labelEn: "One uppercase letter",
    },
    {
      met: /[0-9]/.test(password),
      labelFr: "Un chiffre",
      labelEn: "One digit",
    },
    {
      met: SPECIAL_CHAR_REGEX.test(password),
      labelFr: "Un caractère spécial (!@#$...)",
      labelEn: "One special character (!@#$...)",
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const strength =
    metCount <= 1 ? "weak" : metCount <= 3 ? "medium" : "strong";

  const strengthConfig = {
    weak: {
      labelFr: "Faible",
      labelEn: "Weak",
      color: "bg-red-500",
      textColor: "text-red-400",
    },
    medium: {
      labelFr: "Moyen",
      labelEn: "Medium",
      color: "bg-gold-500",
      textColor: "text-gold-400",
    },
    strong: {
      labelFr: "Fort",
      labelEn: "Strong",
      color: "bg-green-500",
      textColor: "text-green-400",
    },
  };

  const config = strengthConfig[strength];

  return (
    <div className="space-y-3 mt-3">
      {/* Strength label + bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-cream-400">
            {isFr ? "Force du mot de passe" : "Password strength"}
          </span>
          <span className={config.textColor}>
            {isFr ? config.labelFr : config.labelEn}
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${config.color}`}
            style={{ width: `${(metCount / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Criteria list */}
      <ul className="space-y-1">
        {criteria.map((criterion, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            {criterion.met ? (
              <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-white/30 shrink-0" />
            )}
            <span className={criterion.met ? "text-cream-200" : "text-white/40"}>
              {isFr ? criterion.labelFr : criterion.labelEn}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
