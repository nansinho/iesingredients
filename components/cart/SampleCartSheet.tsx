"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ShoppingBag, Trash2, Minus, Plus, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSampleCart } from "@/hooks/useSampleCart";
import { createClient } from "@/lib/supabase/client";
import { sampleRequestSchema } from "@/lib/validations";
import { toast } from "sonner";

export function SampleCartSheet() {
  const locale = useLocale();
  const isFr = locale === "fr";
  const { items, removeItem, updateQuantity, clearCart, itemCount } = useSampleCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const count = itemCount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Client-side Zod validation
    const payload = {
      ...form,
      items: items.map((item) => ({
        code: item.code,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
      })),
    };

    const parsed = sampleRequestSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(isFr ? "Données invalides" : "Invalid data", {
        description: Object.values(parsed.error.flatten().fieldErrors).flat().join(", "),
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch("/api/samples", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          toast.error(isFr ? "Trop de tentatives" : "Too many requests", {
            description: data.error,
          });
          setIsSubmitting(false);
          return;
        }
        throw new Error(data.error || "Failed");
      }

      toast.success(
        isFr ? "Demande envoyée !" : "Request submitted!",
        {
          description: isFr
            ? "Nous traiterons votre demande rapidement."
            : "We will process your request promptly.",
        }
      );

      clearCart();
      setShowForm(false);
      setIsOpen(false);
      setForm({ name: "", email: "", company: "", phone: "", message: "" });
    } catch {
      toast.error(isFr ? "Erreur lors de l'envoi" : "Error submitting request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-white/80 hover:text-white transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 text-forest-900 text-xs font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif">
            {isFr ? "Panier d'échantillons" : "Sample Cart"}
          </SheetTitle>
          <SheetDescription>
            {isFr
              ? `${count} produit${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`
              : `${count} product${count > 1 ? "s" : ""} selected`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-forest-300 mx-auto mb-3" />
              <p className="text-forest-600">
                {isFr ? "Votre panier est vide" : "Your cart is empty"}
              </p>
            </div>
          ) : showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4 px-1">
              <div className="space-y-2">
                <Label>{isFr ? "Nom" : "Name"} *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{isFr ? "Entreprise" : "Company"}</Label>
                  <Input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isFr ? "Téléphone" : "Phone"}</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  {isFr ? "Retour" : "Back"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-forest-900 hover:bg-forest-800 text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {isFr ? "Envoyer" : "Send"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center gap-3 p-3 rounded-xl bg-forest-50 border border-forest-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-forest-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-forest-500">{item.code}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.code, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white border border-forest-200 flex items-center justify-center hover:bg-forest-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.code, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-white border border-forest-200 flex items-center justify-center hover:bg-forest-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.code)}
                    className="p-1.5 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && !showForm && (
          <div className="border-t pt-4 space-y-3">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-gold-500 hover:bg-gold-400 text-forest-900 font-medium rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isFr ? "Demander les échantillons" : "Request Samples"}
            </Button>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isFr ? "Vider le panier" : "Clear Cart"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
