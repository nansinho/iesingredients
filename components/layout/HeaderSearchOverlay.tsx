"use client";

import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

interface HeaderSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function HeaderSearchOverlay({ open, onClose }: HeaderSearchOverlayProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-dark/30 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[61] px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-dark/5 overflow-hidden">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-dark/30" />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  className="w-full h-14 pl-12 pr-4 text-base bg-transparent outline-none placeholder:text-dark/35 text-dark"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      router.push(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        `/catalogue?search=${encodeURIComponent(e.currentTarget.value)}` as any,
                      );
                      onClose();
                    }
                    if (e.key === "Escape") onClose();
                  }}
                />
                <kbd className="absolute right-4 text-xs text-dark/30 bg-cream px-2 py-1 rounded-md font-mono">
                  ESC
                </kbd>
              </div>
              <div className="border-t border-dark/5 px-4 py-3">
                <p className="text-xs text-dark/35">
                  {locale === "fr" ? "Appuyez sur Entrée pour rechercher" : "Press Enter to search"}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
