"use client";

import { useState } from "react";
import { Mail, Eye, MailCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusConfig: Record<string, { icon: React.ElementType; label: string; class: string }> = {
  new: { icon: Clock, label: "Nouveau", class: "bg-blue-100 text-blue-800" },
  read: { icon: Eye, label: "Lu", class: "bg-amber-100 text-amber-800" },
  replied: { icon: MailCheck, label: "Répondu", class: "bg-green-100 text-green-800" },
};

export function ContactsAdmin({ initialContacts }: { initialContacts: any[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const filtered = contacts.filter(
    (c) =>
      !search ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    const { error } = await (supabase.from("contact_submissions") as any)
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Erreur");
      return;
    }
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    if (selected?.id === id) setSelected({ ...selected, status });
    toast.success(`Marqué comme "${statusConfig[status]?.label || status}"`);
  };

  return (
    <>
      <AdminPageHeader
        title="Messages de Contact"
        subtitle={`${contacts.length} messages`}
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom, email ou sujet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-3 py-2 rounded-lg border text-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((contact) => {
          const config = statusConfig[contact.status] || statusConfig.new;
          const Icon = config.icon;
          return (
            <div
              key={contact.id}
              onClick={() => {
                setSelected(contact);
                if (contact.status === "new") updateStatus(contact.id, "read");
              }}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-forest-900">
                      {contact.first_name} {contact.last_name}
                    </span>
                    <Badge className={config.class}>
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-forest-600 truncate">{contact.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {contact.email} &middot;{" "}
                    {contact.created_at
                      ? new Date(contact.created_at).toLocaleDateString("fr-FR")
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun message</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Nom</p>
                  <p className="font-medium">{selected.first_name} {selected.last_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selected.email}</p>
                </div>
                {selected.company && (
                  <div>
                    <p className="text-gray-500">Entreprise</p>
                    <p className="font-medium">{selected.company}</p>
                  </div>
                )}
                {selected.phone && (
                  <div>
                    <p className="text-gray-500">Téléphone</p>
                    <p className="font-medium">{selected.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Message</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant={selected.status === "read" ? "default" : "outline"}
                  onClick={() => updateStatus(selected.id, "read")}
                >
                  <Eye className="w-4 h-4 mr-1" /> Lu
                </Button>
                <Button
                  size="sm"
                  variant={selected.status === "replied" ? "default" : "outline"}
                  onClick={() => updateStatus(selected.id, "replied")}
                >
                  <MailCheck className="w-4 h-4 mr-1" /> Répondu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
