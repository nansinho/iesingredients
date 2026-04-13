"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ComboboxFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function ComboboxField({
  label,
  value,
  onChange,
  options: initialOptions,
  placeholder = "Sélectionner...",
  className,
}: ComboboxFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(initialOptions);
  const [adding, setAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setAdding(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (opt: string) => {
    onChange(opt);
    setOpen(false);
    setSearch("");
  };

  const handleAdd = () => {
    if (!newValue.trim()) return;
    const val = newValue.trim();
    if (!options.includes(val)) {
      setOptions((prev) => [...prev, val].sort());
    }
    onChange(val);
    setNewValue("");
    setAdding(false);
    setOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)} ref={containerRef}>
      <Label className="text-brand-primary">{label}</Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => { setOpen(!open); setAdding(false); }}
          className={cn(
            "flex items-center justify-between w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
            "hover:bg-accent/5 transition-colors",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className={cn("w-4 h-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-border">
              <Input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="h-8 text-sm"
                autoFocus
              />
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {/* Empty option */}
              <button
                type="button"
                onClick={() => handleSelect("")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 transition-colors"
              >
                <span className="italic">Aucun</span>
              </button>

              {filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent/10 transition-colors",
                    value === opt && "bg-brand-accent/10 text-brand-accent font-medium"
                  )}
                >
                  {value === opt && <Check className="w-3.5 h-3.5 shrink-0" />}
                  <span className={cn(value !== opt && "pl-5.5")}>{opt}</span>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  Aucun résultat
                </div>
              )}
            </div>

            {/* Add new value */}
            <div className="border-t border-border p-2">
              {adding ? (
                <div className="flex gap-1.5">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Nouvelle valeur..."
                    className="h-8 text-sm flex-1"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!newValue.trim()}
                    className="h-8 px-3 rounded-md bg-brand-primary text-white text-sm font-medium hover:bg-brand-secondary disabled:opacity-40 transition-colors"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-brand-accent hover:bg-brand-accent/5 rounded-md transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter une valeur
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
