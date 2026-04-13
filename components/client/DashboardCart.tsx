"use client";

import { useSampleCart } from "@/hooks/useSampleCart";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export function DashboardCart() {
  const { items } = useSampleCart();

  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark/[0.06]">
          <ShoppingBag className="h-4 w-4 text-dark/60" strokeWidth={2} />
        </div>
        <h2 className="text-sm font-semibold text-dark/80 uppercase tracking-wider">Mon panier échantillons</h2>
        <span className="text-xs text-dark/40">{items.length} produit{items.length > 1 ? "s" : ""}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <Link
            key={item.code}
            href={{ pathname: "/catalogue/produit/[code]", params: { code: item.code } }}
            className="group flex items-center gap-3 rounded-2xl bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10">
              <ShoppingBag className="h-4 w-4 text-brand-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark truncate">{item.name}</p>
              <p className="text-xs text-dark/40">{item.code} · x{item.quantity}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-dark/0 group-hover:text-dark/40 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
