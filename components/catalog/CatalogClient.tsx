"use client";

import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search, X, Leaf, FlaskConical, Droplets, MessageCircle,
  ArrowRight, ArrowLeft, SlidersHorizontal, ChevronDown, Check,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ParallaxBackground } from "@/components/ui/ParallaxBackground";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ProductCard } from "@/components/catalog/ProductCard";
import { type Product } from "@/lib/product-types";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 24;

/** Map famille name to its image path in /catalogues/ */
const FAMILLE_IMAGES: Record<string, Record<string, string>> = {
  parfum: {
    "Aldéhydique": "/catalogues/Famille Parfums/Aldéhydique.jpg",
    "Ambré": "/catalogues/Famille Parfums/ambré.jpg",
    "Animal": "/catalogues/Famille Parfums/animal.jpg",
    "Aromatique": "/catalogues/Famille Parfums/aromatique.jpg",
    "Balsamique": "/catalogues/Famille Parfums/balsamique.jpg",
    "Boisé": "/catalogues/Famille Parfums/Boisé.jpg",
    "Chypre": "/catalogues/Famille Parfums/chypre.jpg",
    "Floral": "/catalogues/Famille Parfums/floral.jpg",
    "Fruité": "/catalogues/Famille Parfums/fruité.jpg",
    "Gourmand": "/catalogues/Famille Parfums/gourmand.jpg",
    "Hespéridé": "/catalogues/Famille Parfums/hespéridé.jpg",
    "Indéfini": "/catalogues/Famille Parfums/indéfini.jpg",
    "Marine": "/catalogues/Famille Parfums/marine.jpg",
    "Musqué": "/catalogues/Famille Parfums/musqué.jpg",
    "Vert": "/catalogues/Famille Parfums/vert.jpg",
    "Épicé": "/catalogues/Famille Parfums/épicé.jpg",
  },
  cosmetique: {
    "ACTIFS": "/catalogues/Famille Cosmetiques/ACTIFS.jpg",
    "EXTRAITS VEGETAUX": "/catalogues/Famille Cosmetiques/EXTRAITS VEGETAUX.jpg",
    "HUILES ESSENTIELLES": "/catalogues/Famille Cosmetiques/HUILES ESSENTIELLE.jpg",
    "HUILES ESSENTIELLE": "/catalogues/Famille Cosmetiques/HUILES ESSENTIELLE.jpg",
    "HUILE ESSENTIELLE": "/catalogues/Famille Cosmetiques/HUILES ESSENTIELLE.jpg",
    "HUILE ESSENTIELLES": "/catalogues/Famille Cosmetiques/HUILES ESSENTIELLE.jpg",
    "Huiles Essentielles": "/catalogues/Famille Cosmetiques/HUILES ESSENTIELLE.jpg",
    "Huiles essentielles": "/catalogues/Famille Cosmetiques/HUILES ESSENTIELLE.jpg",
    "PERFORMANCE": "/catalogues/Famille Cosmetiques/PERFORMANCE.jpg",
    "SOLAIRE": "/catalogues/Famille Cosmetiques/SOLAIRE.jpg",
    "VITAMINES": "/catalogues/Famille Cosmetiques/VITAMINES.jpg",
  },
  arome: {
    "Citrus": "/catalogues/Famille Aromes/citrus.jpg",
    "High Intensity": "/catalogues/Famille Aromes/high intensity.jpg",
    "Kitchen": "/catalogues/Famille Aromes/kitchen.jpg",
    "Preservation & Texture": "/catalogues/Famille Aromes/preservation_texture.jpg",
    "Synthétique": "/catalogues/Famille Aromes/synthetique.jpg",
    "Wellness & Nutrition": "/catalogues/Famille Aromes/wellness_nutrition.jpg",
    "Wellness & Nutri": "/catalogues/Famille Aromes/wellness_nutrition.jpg",
  },
};

/** Normalize string for accent-insensitive search */
function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getFamilleImage(categoryId: string, familleName: string): string | null {
  const catImages = FAMILLE_IMAGES[categoryId];
  if (!catImages) return null;
  if (catImages[familleName]) return catImages[familleName];
  const lower = familleName.toLowerCase();
  for (const [key, value] of Object.entries(catImages)) {
    if (key.toLowerCase() === lower) return value;
  }
  const norm = normalize(familleName);
  for (const [key, value] of Object.entries(catImages)) {
    if (normalize(key) === norm) return value;
  }
  for (const [key, value] of Object.entries(catImages)) {
    const normKey = normalize(key);
    if (normKey.startsWith(norm) || norm.startsWith(normKey)) return value;
  }
  const normSimple = norm.replace(/e?s$/g, "");
  for (const [key, value] of Object.entries(catImages)) {
    const keySimple = normalize(key).replace(/e?s$/g, "");
    if (keySimple === normSimple) return value;
  }
  return null;
}

const CATEGORIES = [
  {
    id: "cosmetique", table: "cosmetique_fr", icon: Leaf, label: "Cosmétique",
    description: "Actifs botaniques et extraits naturels pour la cosmétique",
    image: "/images/Cosmetique/Portrait Cosmetique.jpg",
    banner: "/images/Cosmetique/Banniere Cosmetique.jpg",
    accent: "#5B7B6B",
  },
  {
    id: "parfum", table: "parfum_fr", icon: FlaskConical, label: "Parfumerie",
    description: "Huiles essentielles, absolues et molécules de synthèse",
    image: "/images/Parfum/Parfum Portrait.jpg",
    banner: "/images/Parfum/Parfum Banniere.jpg",
    accent: "#8B6A80",
  },
  {
    id: "arome", table: "aromes_fr", icon: Droplets, label: "Arômes",
    description: "Arômes naturels et de synthèse pour l'agroalimentaire",
    image: "/images/Aromes/Aromes Portrait.jpg",
    banner: "/images/Aromes/Aromes Banniere.jpg",
    accent: "#D4907E",
  },
] as const;

/** Check if product matches search term */
function matchesSearch(product: Product, term: string): boolean {
  if (!term) return true;
  const n = normalize(term);
  const fields = [
    product.nom_commercial, product.code, product.code_fournisseurs,
    product.description, product.cas_no, product.inci,
    product.famille_olfactive, product.famille_arome, product.famille_cosmetique,
    product.profil_olfactif, product.saveur, product.benefices,
    product.nom_latin,
  ];
  return fields.some((f) => f && normalize(f).includes(n));
}

// ── Filter Dropdown ──
function FilterDropdown({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  if (options.length === 0) return null;
  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border whitespace-nowrap",
          selected.length > 0 ? "bg-brand-accent/10 border-brand-accent/30 text-brand-accent" : "bg-white border-brown/10 text-dark/60 hover:border-brown/20"
        )}>
          {label}
          {selected.length > 0 && <span className="w-5 h-5 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center">{selected.length}</span>}
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="w-56 p-1.5 rounded-xl border-brown/10 shadow-xl">
        <div className="max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const sel = selected.includes(opt);
            return (
              <button key={opt} onClick={() => toggle(opt)} className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                sel ? "bg-brand-accent/10 text-brand-accent font-medium" : "text-dark/70 hover:bg-cream"
              )}>
                <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", sel ? "bg-brand-accent border-brand-accent" : "border-brown/20")}>
                  {sel && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{opt}</span>
              </button>
            );
          })}
        </div>
        {selected.length > 0 && (
          <div className="border-t border-brown/8 pt-1.5 mt-1.5">
            <button onClick={() => onChange([])} className="w-full text-xs text-dark/40 hover:text-dark py-1.5 rounded-lg hover:bg-cream transition-colors">Tout désélectionner</button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Filter Accordion (sidebar) ──
function FilterAccordion({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(selected.length > 0);
  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);

  return (
    <div className="border-b border-white/8">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white/80 hover:bg-white/5 transition-colors">
        <span className="flex items-center gap-2">
          {label}
          {selected.length > 0 && <span className="w-5 h-5 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center">{selected.length}</span>}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-1">
          {options.map((opt) => {
            const sel = selected.includes(opt);
            return (
              <button key={opt} onClick={() => toggle(opt)} className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
                sel ? "bg-brand-accent/20 text-brand-accent font-medium" : "text-white/50 hover:bg-white/5"
              )}>
                <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors", sel ? "bg-brand-accent border-brand-accent" : "border-white/20")}>
                  {sel && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                <span className="truncate">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Catalog Landing (no category selected) ──
const CATEGORY_ROUTES_LANDING = {
  cosmetique: "/catalogue/cosmetique" as const,
  parfum: "/catalogue/parfumerie" as const,
  arome: "/catalogue/aromes" as const,
};

function CatalogLanding({ allProducts }: { allProducts: Product[] }) {
  // Best sellers: pick 6 products with images, one from each category
  const bestProducts = useMemo(() => {
    const withImg = allProducts.filter((p) => p.image_url);
    const pick: Product[] = [];
    for (const table of ["cosmetique_fr", "parfum_fr", "aromes_fr"]) {
      const fromTable = withImg.filter((p) => p._table === table);
      pick.push(...fromTable.slice(0, 2));
    }
    return pick.length >= 6 ? pick.slice(0, 6) : withImg.slice(0, 6);
  }, [allProducts]);

  // Latest arrived: sort by created_at desc, take 6
  const latestProducts = useMemo(() => {
    return [...allProducts]
      .filter((p) => p.created_at)
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(0, 6);
  }, [allProducts]);

  return (
    <div className="space-y-16">
      {/* Section 1 — Nos univers */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark">Nos univers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = allProducts.filter((p) => p._table === cat.table).length;
            return (
              <Link
                key={cat.id}
                href={CATEGORY_ROUTES_LANDING[cat.id] || "/catalogue"}
                className="group relative text-left h-[220px] md:h-[260px] overflow-hidden flex rounded-2xl"
              >
                <div className="relative z-10 w-10 md:w-12 shrink-0 flex items-center justify-center" style={{ backgroundColor: cat.accent }}>
                  <span className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.25em] select-none whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{cat.label}</span>
                </div>
                <div className="relative flex-1">
                  <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-playfair font-bold text-white mb-1">{cat.label}</h3>
                    <p className="text-white/50 text-xs">{count} produits</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 2 — Familles populaires */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-dark">Les familles les plus aimées</h2>
            <p className="text-dark/40 text-sm mt-1">Découvrez nos familles d'ingrédients populaires</p>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Object.entries(FAMILLE_IMAGES).flatMap(([catId, families]) => {
            // Dédupliquer par image (éviter les variantes de noms)
            const seen = new Set<string>();
            const unique: [string, string][] = [];
            for (const [name, img] of Object.entries(families)) {
              if (!seen.has(img)) { seen.add(img); unique.push([name, img]); }
            }
            return unique.slice(0, 4).map(([name, img]) => (
              <Link
                key={`${catId}-${name}`}
                href={CATEGORY_ROUTES_LANDING[catId as keyof typeof CATEGORY_ROUTES_LANDING] || "/catalogue"}
                className="group relative rounded-xl overflow-hidden aspect-square hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              >
                <Image src={img} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 640px) 33vw, 16vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md leading-tight block">{name}</span>
                </div>
              </Link>
            ));
          })}
        </div>
      </div>

      {/* Section 3 — Sélection */}
      {bestProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-dark">Notre sélection</h2>
              <p className="text-dark/40 text-sm mt-1">Des ingrédients d'exception pour vos formulations</p>
            </div>
          </div>
          <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {bestProducts.map((product) => (
              <ProductCard key={`${product._table}-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Section 3 — Derniers arrivés */}
      {latestProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-dark">Derniers arrivés</h2>
              <p className="text-dark/40 text-sm mt-1">Les nouveautés de notre catalogue</p>
            </div>
          </div>
          <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {latestProducts.map((product) => (
              <ProductCard key={`latest-${product._table}-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Section 4 — Stats */}
      <div className="grid grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = allProducts.filter((p) => p._table === cat.table).length;
          return (
            <Link key={cat.id} href={CATEGORY_ROUTES_LANDING[cat.id] || "/catalogue"} className="p-6 rounded-2xl bg-white border border-brown/8 hover:border-brown/15 transition-all hover:-translate-y-1 hover:shadow-lg text-left group block">
              <Icon className="w-6 h-6 mb-3" style={{ color: cat.accent }} />
              <p className="text-2xl md:text-3xl font-bold text-dark">{count}</p>
              <p className="text-sm text-dark/40 mt-1">ingrédients {cat.label}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium group-hover:gap-2 transition-all" style={{ color: cat.accent }}>
                Explorer <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ── Famille Carousel ──
function FamilleCarousel({ familleValues, category, famille, currentCat, onSelect }: {
  familleValues: string[];
  category: string;
  famille: string;
  currentCat: typeof CATEGORIES[number] | undefined;
  onSelect: (fam: string) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", dragFree: true, containScroll: "trimSnaps", slidesToScroll: 3 });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); emblaApi.off("reInit", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative group/carousel">
      {/* Flèches */}
      {canPrev && (
        <button onClick={scrollPrev} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-brown/10 flex items-center justify-center hover:bg-cream transition-all">
          <ArrowLeft className="w-4 h-4 text-dark/60" />
        </button>
      )}
      {canNext && (
        <button onClick={scrollNext} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-brown/10 flex items-center justify-center hover:bg-cream transition-all">
          <ArrowRight className="w-4 h-4 text-dark/60" />
        </button>
      )}

      <div className="overflow-hidden -mx-1 px-1" ref={emblaRef}>
        <div className="flex gap-3 py-1">
          {familleValues.map((fam) => {
            const img = getFamilleImage(category, fam);
            const active = famille === fam;
            return (
              <div key={fam} className="flex-[0_0_140px] min-w-0">
                <button
                  onClick={() => onSelect(fam)}
                  className={cn(
                    "group relative rounded-xl overflow-hidden transition-all duration-200 w-full aspect-[4/3]",
                    active ? "ring-2 ring-offset-2" : "hover:-translate-y-1 hover:shadow-lg"
                  )}
                  style={active && currentCat ? { "--tw-ring-color": currentCat.accent } as React.CSSProperties : undefined}
                >
                  {img ? (
                    <>
                      <Image src={img} alt={fam} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="120px" />
                      <div className={cn(
                        "absolute inset-0 transition-all duration-200",
                        active ? "bg-black/50" : "bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                      )} />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <span className="text-[11px] font-bold text-white drop-shadow-md leading-tight block">{fam}</span>
                      </div>
                      {active && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: currentCat?.accent }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center p-2 border rounded-xl transition-all",
                      active ? "bg-brand-accent/10 border-brand-accent/30" : "bg-white border-brown/8 hover:border-brown/20"
                    )}>
                      <span className={cn("text-[11px] font-bold text-center leading-tight", active ? "text-brand-accent" : "text-dark/70")}>{fam}</span>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export function CatalogClient({ allProducts, initialCategory = "" }: { allProducts: Product[]; initialCategory?: string }) {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(urlSearch);
  const [category] = useState(initialCategory);
  const [famille, setFamille] = useState("");
  const [page, setPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Show sticky bar only when hero is scrolled out of view
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setSearch(urlSearch);
    setPage(1);
  }, [urlSearch]);

  const makeEmptyFilters = () => ({
    origine: [] as string[], aspect: [] as string[], solubilite: [] as string[],
    application: [] as string[], type_de_peau: [] as string[], saveur: [] as string[],
    certifications: [] as string[], food_grade: [] as string[], tracabilite: [] as string[],
    partie_utilisee: [] as string[], conservateurs: [] as string[], base: [] as string[],
  });
  const [filters, setFilters] = useState<Record<string, string[]>>(makeEmptyFilters);

  const updateFilter = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
    setPage(1);
  };

  const currentCat = CATEGORIES.find((c) => c.id === category);

  // Products for current category
  const categoryProducts = useMemo(() => {
    if (!category) return allProducts;
    const cat = CATEGORIES.find((c) => c.id === category);
    if (!cat) return allProducts;
    return allProducts.filter((p) => p._table === cat.table);
  }, [allProducts, category]);

  // Famille values
  const familleValues = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      const val = p._table === "parfum_fr" ? p.famille_olfactive
        : p._table === "aromes_fr" ? p.famille_arome
        : p.famille_cosmetique;
      if (val) set.add(val);
    });
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  }, [categoryProducts]);

  // Filter options
  const filterOptions = useMemo(() => {
    const src = famille && famille !== "all"
      ? categoryProducts.filter((p) => {
          const val = p._table === "parfum_fr" ? p.famille_olfactive : p._table === "aromes_fr" ? p.famille_arome : p.famille_cosmetique;
          return val === famille;
        })
      : categoryProducts;

    const extract = (fn: (p: Product) => string | null | undefined) => {
      const set = new Set<string>();
      src.forEach((p) => { const v = fn(p); if (v) set.add(v); });
      return [...set].sort();
    };

    return {
      origines: extract((p) => p.origine || ((p as unknown as Record<string, unknown>).origin as string)),
      aspects: extract((p) => p.aspect),
      solubilites: extract((p) => p.solubilite),
      applications: extract((p) => p.application),
      types_de_peau: extract((p) => p.type_de_peau),
      saveurs: extract((p) => p.saveur),
      certifications: extract((p) => p.certifications),
      food_grades: extract((p) => p.food_grade),
      tracabilites: extract((p) => p.tracabilite),
      parties_utilisees: extract((p) => p.partie_utilisee),
      conservateurs: extract((p) => p.conservateurs),
      bases: extract((p) => p.base),
    };
  }, [categoryProducts, famille]);

  // Filtered products
  const filtered = useMemo(() => {
    let result = categoryProducts;

    if (famille && famille !== "all") {
      result = result.filter((p) => {
        const val = p._table === "parfum_fr" ? p.famille_olfactive : p._table === "aromes_fr" ? p.famille_arome : p.famille_cosmetique;
        return val === famille;
      });
    }

    if (search) {
      result = result.filter((p) => matchesSearch(p, search));
    }

    if (filters.origine.length > 0) {
      result = result.filter((p) => {
        const val = p.origine || ((p as unknown as Record<string, unknown>).origin as string);
        return val && filters.origine.includes(val);
      });
    }
    if (filters.aspect.length > 0) result = result.filter((p) => p.aspect && filters.aspect.includes(p.aspect));
    if (filters.solubilite.length > 0) result = result.filter((p) => p.solubilite && filters.solubilite.includes(p.solubilite));
    if (filters.application.length > 0) result = result.filter((p) => p.application && filters.application.includes(p.application));
    if (filters.type_de_peau.length > 0) result = result.filter((p) => p.type_de_peau && filters.type_de_peau.includes(p.type_de_peau));
    if (filters.saveur.length > 0) result = result.filter((p) => p.saveur && filters.saveur.includes(p.saveur));
    if (filters.certifications.length > 0) result = result.filter((p) => p.certifications && filters.certifications.includes(p.certifications));
    if (filters.food_grade.length > 0) result = result.filter((p) => p.food_grade && filters.food_grade.includes(p.food_grade));
    if (filters.tracabilite.length > 0) result = result.filter((p) => p.tracabilite && filters.tracabilite.includes(p.tracabilite));
    if (filters.partie_utilisee.length > 0) result = result.filter((p) => p.partie_utilisee && filters.partie_utilisee.includes(p.partie_utilisee));
    if (filters.conservateurs.length > 0) result = result.filter((p) => p.conservateurs && filters.conservateurs.includes(p.conservateurs));
    if (filters.base.length > 0) result = result.filter((p) => p.base && filters.base.includes(p.base));

    return result;
  }, [categoryProducts, famille, search, filters]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pageProducts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalActiveFilters = Object.values(filters).reduce((s, a) => s + a.length, 0);

  // Category navigation is now done via Link (route-based)
  const CATEGORY_ROUTES = {
    cosmetique: "/catalogue/cosmetique" as const,
    parfum: "/catalogue/parfumerie" as const,
    arome: "/catalogue/aromes" as const,
  };

  const selectFamille = (f: string) => { setFamille(f); setPage(1); };

  const clearFilters = () => {
    setSearch(""); setFamille("");
    setFilters(makeEmptyFilters());
    setPage(1);
  };

  const filterConfigs = useMemo(() => {
    const all: { key: string; label: string; options: string[] }[] = [
      { key: "origine", label: "Origine", options: filterOptions.origines },
      { key: "aspect", label: "Aspect", options: filterOptions.aspects },
      { key: "solubilite", label: "Solubilité", options: filterOptions.solubilites },
      { key: "application", label: "Application", options: filterOptions.applications },
      { key: "type_de_peau", label: "Type de peau", options: filterOptions.types_de_peau },
      { key: "partie_utilisee", label: "Partie utilisée", options: filterOptions.parties_utilisees },
      { key: "saveur", label: "Saveur", options: filterOptions.saveurs },
      { key: "base", label: "Base", options: filterOptions.bases },
      { key: "food_grade", label: "Food grade", options: filterOptions.food_grades },
      { key: "conservateurs", label: "Conservateurs", options: filterOptions.conservateurs },
      { key: "certifications", label: "Certifications", options: filterOptions.certifications },
      { key: "tracabilite", label: "Traçabilité", options: filterOptions.tracabilites },
    ];
    return all.filter((c) => c.options.length > 0);
  }, [filterOptions]);


  return (
    <>
      {/* ── Hero — style actualités ── */}
      <section ref={heroRef} className="relative min-h-[50vh] flex items-end overflow-hidden">
        <ParallaxBackground className="absolute inset-0">
          <Image
            src={currentCat ? currentCat.banner : "/images/hero-botanical.jpg"}
            alt="Catalogue IES Ingredients"
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/75 to-brand-primary/40" />
        </ParallaxBackground>

        <div className="relative z-10 w-[94%] max-w-7xl mx-auto pb-16 pt-40 text-center">
          <AnimateIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-[0.15em] mb-5 backdrop-blur-sm">
              <Search className="w-3.5 h-3.5" />
              Catalogue
            </span>
          </AnimateIn>
          <AnimateIn delay={0.1} y={30}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6">
              {currentCat ? (
                <>{currentCat.label}</>
              ) : (
                <>Nos{" "}<span className="font-playfair italic">ingrédients</span></>
              )}
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              {currentCat
                ? currentCat.description
                : `${allProducts.length} ingrédients pour la parfumerie, cosmétique et arômes alimentaires.`
              }
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3} y={15}>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/25" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, code, INCI, CAS, famille..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-13 pr-10 h-14 bg-white border border-white/20 text-dark placeholder:text-dark/30 focus:ring-2 focus:ring-brand-accent/30 rounded-full text-base shadow-lg outline-none transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ══ MODE LANDING (pas de catégorie, pas de recherche) ══ */}
      {!category && !search && (
        <section className="bg-cream-light py-12">
          <div className="w-[94%] max-w-7xl mx-auto">
            <CatalogLanding allProducts={allProducts} />
          </div>
        </section>
      )}

      {/* ══ MODE CATALOGUE (catégorie ou recherche active) ══ */}
      {(category || search) && (
        <div>
          {/* Category Tabs — fixed after scroll */}
          <div className={cn(
            "py-4 z-40 backdrop-blur-md bg-cream-light/95 border-b border-brown/8 transition-all duration-300",
            showStickyBar ? "fixed left-0 right-0 top-[64px] lg:top-[108px] shadow-sm" : "relative"
          )}>
            <div className="w-[94%] max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
                  <Link
                    href="/catalogue"
                    className="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-dark/50 border border-brown/10 hover:border-brown/20 hover:text-dark transition-all duration-200"
                  >
                    Tout
                  </Link>
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = category === cat.id;
                    return (
                      <Link
                        key={cat.id}
                        href={CATEGORY_ROUTES[cat.id as keyof typeof CATEGORY_ROUTES] || "/catalogue"}
                        className={cn(
                          "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                          active
                            ? "text-white shadow-md"
                            : "bg-white text-dark/50 border border-brown/10 hover:border-brown/20 hover:text-dark"
                        )}
                        style={active ? { backgroundColor: cat.accent } : undefined}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.label}
                      </Link>
                    );
                  })}
                </div>
                {/* Filter button — always visible in sticky bar */}
                {filterConfigs.length > 0 && (
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-white border border-brown/10 text-dark/70 hover:border-brown/20 hover:text-dark transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtrer
                    {totalActiveFilters > 0 && <span className="w-5 h-5 rounded-full bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center">{totalActiveFilters}</span>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Spacer when bar is fixed */}
          {showStickyBar && <div className="h-[56px]" />}

          {/* Famille Strip (only when category, not search) */}
          {category && !search && (
            <section className="bg-cream-light py-6">
              <div className="w-[94%] max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-dark">
                    {currentCat && (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCat.accent }} />
                        Familles {currentCat.label}
                      </span>
                    )}
                  </h2>
                  {famille && (
                    <button onClick={() => { setFamille(""); setPage(1); }} className="text-sm text-dark/40 hover:text-dark transition-colors flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Toutes les familles
                    </button>
                  )}
                </div>
                <FamilleCarousel
                  familleValues={familleValues}
                  category={category}
                  famille={famille}
                  currentCat={currentCat}
                  onSelect={(fam) => selectFamille(famille === fam ? "" : fam)}
                />
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Products (only when category or search is active) ── */}
      {(category || search) && (
        <section className="bg-cream-light py-6 sm:py-8 min-h-[50vh]">
          <div className="w-[94%] max-w-7xl mx-auto">

            {/* Filter sidebar (controlled by sticky bar button) */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent side="left" className="w-[340px] p-0 bg-brand-primary border-r-0">
                <SheetHeader className="px-5 py-5 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-bold text-white">Filtres</SheetTitle>
                    {totalActiveFilters > 0 && (
                      <button onClick={() => setFilters(makeEmptyFilters())} className="text-xs text-brand-accent font-medium hover:underline">
                        Tout réinitialiser
                      </button>
                    )}
                  </div>
                </SheetHeader>
                <div className="overflow-y-auto flex-1">
                  {filterConfigs.map((fc) => (
                    <FilterAccordion key={fc.key} label={fc.label} options={fc.options} selected={filters[fc.key] || []} onChange={(v) => updateFilter(fc.key, v)} />
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Active filters + count */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center gap-2 flex-wrap">
                {totalActiveFilters > 0 && (
                  <button onClick={() => setFilters(makeEmptyFilters())} className="text-xs text-dark/40 hover:text-dark flex items-center gap-1">
                    <X className="w-3 h-3" /> Réinitialiser les filtres
                  </button>
                )}
                <span className="text-sm text-dark/40 font-medium ml-auto">{total} produits</span>
              </div>

              {/* Active filter badges */}
              {totalActiveFilters > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).flatMap(([key, vals]) =>
                    vals.map((v) => (
                      <Badge key={`${key}-${v}`} variant="secondary" className="gap-1.5 pr-1.5 cursor-pointer bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 border border-brand-accent/20"
                        onClick={() => updateFilter(key, filters[key].filter((s) => s !== v))}>
                        {v} <X className="h-3 w-3" />
                      </Badge>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              <motion.div key={`${category}-${famille}-${search}-${page}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {pageProducts.length > 0 ? (
                  <>
                    <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {pageProducts.map((product) => (
                        <div key={`${product._table}-${product.id}`}>
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-12 flex items-center justify-center gap-3">
                        {page > 1 && <Button variant="outline" onClick={() => { setPage(page - 1); window.scrollTo({ top: 400, behavior: "smooth" }); }} className="rounded-full px-6 h-11 border-brown/15 hover:border-peach">&larr;</Button>}
                        <span className="px-5 py-2.5 text-sm text-dark/60 font-medium bg-white rounded-full border border-brown/8">{page} / {totalPages}</span>
                        {page < totalPages && <Button variant="outline" onClick={() => { setPage(page + 1); window.scrollTo({ top: 400, behavior: "smooth" }); }} className="rounded-full px-6 h-11 border-brown/15 hover:border-peach">&rarr;</Button>}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-24">
                    <Search className="w-12 h-12 text-brown/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-dark mb-2">Aucun produit trouvé</h3>
                    <Button variant="outline" onClick={clearFilters} className="mt-4 rounded-full px-8 border-brown/15">Réinitialiser</Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Help CTA */}
      <section className="py-20 bg-cream-light">
        <div className="w-[94%] max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-brand-primary p-10 md:p-16 text-center">
            {/* Cercles décoratifs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-accent/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10">
              <MessageCircle className="w-10 h-10 text-brand-accent/50 mx-auto mb-5" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Besoin d&apos;aide pour trouver <span className="font-playfair italic text-brand-accent">un ingrédient</span> ?
              </h3>
              <p className="text-white/50 text-base max-w-lg mx-auto mb-8">
                Notre équipe commerciale est à votre disposition pour vous accompagner dans vos recherches et formulations.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-accent text-white text-sm font-semibold hover:bg-brand-accent-hover transition-all shadow-lg hover:shadow-xl hover:gap-3">
                Contactez-nous <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
