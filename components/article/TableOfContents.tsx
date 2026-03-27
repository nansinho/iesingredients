"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  title: string;
}

export function TableOfContents({ headings, title }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="hidden xl:block sticky top-28 w-56 shrink-0 self-start"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-primary/40 dark:text-cream-light/30 mb-4">
        {title}
      </p>
      <div className="relative border-l border-brand-primary/10 dark:border-cream-light/10">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block text-[13px] leading-snug transition-all duration-200 ${
                heading.level === 3 ? "pl-6" : "pl-4"
              } py-1.5 ${
                isActive
                  ? "text-brand-accent font-medium border-l-2 border-brand-accent -ml-px"
                  : "text-brand-primary/40 dark:text-cream-light/30 hover:text-brand-primary/70 dark:hover:text-cream-light/60"
              }`}
            >
              {heading.text}
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
