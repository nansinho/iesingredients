"use client";

import { useState } from "react";
import { Link2, Linkedin, Twitter, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonsProps {
  title: string;
  copiedLabel: string;
}

export function ShareButtons({ title, copiedLabel }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "width=600,height=500"
    );
  };

  const shareX = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "width=600,height=500"
    );
  };

  const buttons = [
    {
      action: handleCopy,
      icon: copied ? Check : Link2,
      label: copied ? copiedLabel : "Copy link",
    },
    { action: shareLinkedIn, icon: Linkedin, label: "LinkedIn" },
    { action: shareX, icon: Twitter, label: "X" },
  ];

  return (
    <div className="flex items-center gap-3">
      {buttons.map((btn) => {
        const Icon = btn.icon;
        return (
          <button
            key={btn.label}
            onClick={btn.action}
            aria-label={btn.label}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-primary/10 dark:border-cream-light/10 text-brand-primary/50 dark:text-cream-light/40 hover:text-brand-accent hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all duration-200 text-sm"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={btn.icon === Check ? "check" : "icon"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Icon className="w-4 h-4" />
              </motion.span>
            </AnimatePresence>
            <span>{btn.label}</span>
          </button>
        );
      })}
    </div>
  );
}
