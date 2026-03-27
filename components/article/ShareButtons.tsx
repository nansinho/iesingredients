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
    <>
      {/* Desktop - sticky left sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="hidden lg:flex sticky top-28 flex-col gap-2 w-10 shrink-0 self-start"
      >
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              onClick={btn.action}
              aria-label={btn.label}
              className="w-10 h-10 rounded-full border border-[var(--brand-primary)]/8 dark:border-cream-light/10 flex items-center justify-center text-[var(--brand-primary)]/35 dark:text-cream-light/30 hover:text-[var(--brand-accent)] hover:border-[var(--brand-accent)]/30 hover:bg-[var(--brand-accent)]/5 transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </motion.div>

      {/* Mobile - fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-xl border-t border-[var(--brand-primary)]/8 dark:border-cream-light/10 px-6 py-3 flex items-center justify-center gap-6 safe-area-inset-bottom">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              onClick={btn.action}
              aria-label={btn.label}
              className="flex items-center gap-2 text-[var(--brand-primary)]/50 dark:text-cream-light/40 hover:text-[var(--brand-accent)] transition-colors"
            >
              <Icon className="w-4 h-4" />
              <AnimatePresence mode="wait">
                {btn.label === copiedLabel && copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs font-medium text-[var(--brand-accent)]"
                  >
                    {copiedLabel}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </>
  );
}
