"use client";

import { useEffect, useRef, useMemo } from "react";

interface ArticleContentProps {
  html: string;
}

/**
 * Split merged blockquotes: if a <blockquote> contains multiple <p>,
 * re-separate each <p> (with its preceding <img> tags) into its own <blockquote>.
 * Uses DOM parsing for reliability.
 */
function splitBlockquotes(html: string): string {
  if (typeof document === "undefined") return html;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  const blockquotes = wrapper.querySelectorAll("blockquote");
  blockquotes.forEach((bq) => {
    const paragraphs = bq.querySelectorAll(":scope > p");
    if (paragraphs.length <= 1) return; // Single paragraph — keep as-is

    // Group each <p> with any preceding <img> siblings
    const groups: Node[][] = [];
    let currentGroup: Node[] = [];

    Array.from(bq.childNodes).forEach((node) => {
      if (node.nodeName === "P") {
        currentGroup.push(node);
        groups.push(currentGroup);
        currentGroup = [];
      } else {
        currentGroup.push(node);
      }
    });

    // Replace the original blockquote with separate ones
    const fragment = document.createDocumentFragment();
    groups.forEach((group) => {
      const newBq = document.createElement("blockquote");
      group.forEach((n) => newBq.appendChild(n.cloneNode(true)));
      fragment.appendChild(newBq);
    });
    bq.replaceWith(fragment);
  });

  return wrapper.innerHTML;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const processedHtml = useMemo(() => splitBlockquotes(html), [html]);

  useEffect(() => {
    if (!ref.current) return;

    // Add IDs to headings for ToC anchoring
    const headings = ref.current.querySelectorAll("h2, h3");
    headings.forEach((heading, i) => {
      if (!heading.id) {
        heading.id = `heading-${i}`;
      }
    });
  }, [processedHtml]);

  return (
    <div
      ref={ref}
      className="article-prose prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-dark dark:prose-headings:text-cream-light prose-headings:tracking-tight prose-p:leading-[1.85] prose-a:text-brand-accent dark:prose-a:text-brand-accent prose-a:underline prose-a:decoration-brand-accent/30 prose-a:underline-offset-4 hover:prose-a:decoration-brand-accent prose-img:rounded-xl prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-14 prose-h2:mb-5 prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-4"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
