"use client";

import { useEffect, useRef } from "react";

interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Add IDs to headings for ToC anchoring
    const headings = ref.current.querySelectorAll("h2, h3");
    headings.forEach((heading, i) => {
      if (!heading.id) {
        heading.id = `heading-${i}`;
      }
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="article-prose prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-dark dark:prose-headings:text-cream-light prose-headings:tracking-tight prose-p:text-dark/75 dark:prose-p:text-cream-light/65 prose-p:leading-[1.85] prose-a:text-brand-accent dark:prose-a:text-brand-accent prose-a:underline prose-a:decoration-brand-accent/30 prose-a:underline-offset-4 hover:prose-a:decoration-brand-accent prose-blockquote:border-l-[3px] prose-blockquote:border-brand-accent prose-blockquote:bg-brand-accent-light/20 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-dark/60 dark:prose-blockquote:text-cream-light/50 prose-blockquote:font-normal prose-img:rounded-2xl prose-img:shadow-lg prose-strong:text-dark dark:prose-strong:text-cream-light prose-li:text-dark/70 dark:prose-li:text-cream-light/60 prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-14 prose-h2:mb-5 prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
