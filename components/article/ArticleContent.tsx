"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import DOMPurify from "isomorphic-dompurify";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import EmblaCarousel from "embla-carousel";

interface ArticleContentProps {
  html: string;
}

/**
 * Split merged blockquotes: if a <blockquote> contains multiple <p>,
 * re-separate each <p> (with its preceding <img> tags) into its own <blockquote>.
 */
function splitBlockquotes(html: string): string {
  if (typeof document === "undefined") return html;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;

  const blockquotes = wrapper.querySelectorAll("blockquote");
  blockquotes.forEach((bq) => {
    const paragraphs = bq.querySelectorAll(":scope > p");
    if (paragraphs.length <= 1) return;

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

/**
 * Initialize Embla Carousel on .image-carousel elements.
 */
function initCarousels(container: HTMLElement) {
  const carousels = container.querySelectorAll<HTMLElement>(".image-carousel");
  const instances: ReturnType<typeof EmblaCarousel>[] = [];

  carousels.forEach((carousel) => {
    const imgs = carousel.querySelectorAll("img");
    if (imgs.length < 2) return;

    const viewport = document.createElement("div");
    viewport.className = "carousel-viewport";
    const track = document.createElement("div");
    track.className = "carousel-container";

    imgs.forEach((img) => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      slide.appendChild(img.cloneNode(true));
      track.appendChild(slide);
    });

    viewport.appendChild(track);
    carousel.innerHTML = "";
    carousel.appendChild(viewport);

    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-nav prev";
    prevBtn.innerHTML = "&#8249;";
    prevBtn.setAttribute("aria-label", "Précédent");

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-nav next";
    nextBtn.innerHTML = "&#8250;";
    nextBtn.setAttribute("aria-label", "Suivant");

    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);

    const counter = document.createElement("div");
    counter.className = "carousel-counter";
    counter.textContent = `1 / ${imgs.length}`;
    carousel.appendChild(counter);

    const dotsContainer = document.createElement("div");
    dotsContainer.className = "carousel-dots";

    for (let i = 0; i < imgs.length; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Image ${i + 1}`);
      dotsContainer.appendChild(dot);
    }
    carousel.appendChild(dotsContainer);

    const embla = EmblaCarousel(viewport, { loop: true });
    instances.push(embla);

    prevBtn.addEventListener("click", () => embla.scrollPrev());
    nextBtn.addEventListener("click", () => embla.scrollNext());

    const dots = dotsContainer.querySelectorAll<HTMLElement>(".carousel-dot");
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => embla.scrollTo(i));
    });

    embla.on("select", () => {
      const idx = embla.selectedScrollSnap();
      counter.textContent = `${idx + 1} / ${imgs.length}`;
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === idx);
      });
    });
  });

  return () => {
    instances.forEach((e) => e.destroy());
  };
}

// ── Lightbox Component ──

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { src: string; alt: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Fermer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm font-medium">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div className="relative z-10 max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index].src}
          alt={images[index].alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Suivant"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

/**
 * Wrap 3+ consecutive <img> elements (not already in a grid/carousel)
 * into a <div class="image-grid">. Pure string-based — works on server and client.
 */
function autoGridImages(html: string): string {
  // Skip if already has image-grid or image-carousel
  if (html.includes('class="image-grid"') || html.includes('class="image-carousel"')) {
    return html;
  }
  // Match 3+ consecutive <img> tags (with optional whitespace between them)
  const imgTag = '<img\\s[^>]*?>';
  const pattern = new RegExp(
    `(${imgTag})(?:\\s*(${imgTag}))+`,
    'gi'
  );

  return html.replace(pattern, (match) => {
    const count = (match.match(/<img\s/gi) || []).length;
    if (count < 3) return match;
    return `<div class="image-grid">${match}</div>`;
  });
}

// ── Main Component ──

export function ArticleContent({ html }: ArticleContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const processedHtml = useMemo(() => autoGridImages(splitBlockquotes(html)), [html]);
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Add IDs to headings for ToC anchoring
    const headings = ref.current.querySelectorAll("h2, h3");
    headings.forEach((heading, i) => {
      if (!heading.id) {
        heading.id = `heading-${i}`;
      }
    });

    // Initialize carousels
    const destroyCarousels = initCarousels(ref.current);

    // Make all images clickable for lightbox
    const allImages = ref.current.querySelectorAll<HTMLImageElement>("img");
    const imageList = Array.from(allImages).map((img) => ({
      src: img.src,
      alt: img.alt || "",
    }));

    const handlers: Array<() => void> = [];
    allImages.forEach((img, i) => {
      img.style.cursor = "pointer";
      const handler = () => {
        setLightbox({ images: imageList, index: i });
      };
      img.addEventListener("click", handler);
      handlers.push(() => img.removeEventListener("click", handler));
    });

    return () => {
      destroyCarousels();
      handlers.forEach((cleanup) => cleanup());
    };
  }, [processedHtml]);

  return (
    <>
      <div
        ref={ref}
        className="article-prose prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-dark dark:prose-headings:text-cream-light prose-headings:tracking-tight prose-p:leading-[1.85] prose-a:text-brand-accent dark:prose-a:text-brand-accent prose-a:underline prose-a:decoration-brand-accent/30 prose-a:underline-offset-4 hover:prose-a:decoration-brand-accent prose-img:rounded-xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(processedHtml, {
            ALLOWED_TAGS: [
              "h1", "h2", "h3", "h4", "h5", "h6",
              "p", "br", "hr", "div", "span",
              "strong", "em", "b", "i", "u", "s", "sub", "sup",
              "a", "img", "figure", "figcaption",
              "ul", "ol", "li",
              "blockquote", "pre", "code",
              "table", "thead", "tbody", "tr", "th", "td",
            ],
            ALLOWED_ATTR: [
              "href", "src", "alt", "title", "class", "id",
              "target", "rel", "width", "height", "loading",
              "data-carousel", "data-carousel-item",
            ],
          }),
        }}
      />
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
