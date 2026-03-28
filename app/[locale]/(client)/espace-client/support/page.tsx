"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LifeBuoy,
  Plus,
  Send,
  ArrowLeft,
  Clock,
  CheckCircle,
  Loader2,
  MessageCircle,
  Paperclip,
  FileText,
  ImageIcon,
  X,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  is_admin: boolean;
  message: string;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: "general", label: "Général" },
  { value: "commande", label: "Commande" },
  { value: "facturation", label: "Facturation" },
  { value: "technique", label: "Technique" },
];

const PRIORITIES = [
  { value: "low", label: "Basse", color: "#6B7280" },
  { value: "normal", label: "Normale", color: "#3B82F6" },
  { value: "high", label: "Haute", color: "#F59E0B" },
  { value: "urgent", label: "Urgente", color: "#EF4444" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: "Ouvert", color: "#F59E0B" },
  in_progress: { label: "En cours", color: "#3B82F6" },
  resolved: { label: "Résolu", color: "#10B981" },
  closed: { label: "Fermé", color: "#6B7280" },
};

function AttachmentPreview({ url, name }: { url: string; name: string }) {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2 rounded-lg overflow-hidden max-w-[240px] border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={name} className="w-full h-auto" />
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs">
      <FileText className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{name}</span>
    </a>
  );
}

export default function ClientSupportPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newPriority, setNewPriority] = useState("normal");
  const [newFirstMessage, setNewFirstMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mobileShowConversation, setMobileShowConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTickets = useCallback(async () => {
    const { data } = await (supabase.from("support_tickets") as ReturnType<typeof supabase.from>)
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setTickets(data as unknown as Ticket[]);
    setLoading(false);
  }, [supabase]);

  const fetchMessages = useCallback(async (ticketId: string) => {
    const { data } = await (supabase.from("support_messages") as ReturnType<typeof supabase.from>)
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as unknown as Message[]);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
    fetchTickets();
  }, [fetchTickets, supabase]);

  useEffect(() => {
    if (activeTicket) fetchMessages(activeTicket.id);
    else setMessages([]);
  }, [activeTicket, fetchMessages]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!activeTicket) return;
    const channel = supabase
      .channel(`support-messages-${activeTicket.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages", filter: `ticket_id=eq.${activeTicket.id}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTicket, supabase]);

  // Real-time for ticket updates (status changes)
  useEffect(() => {
    const channel = supabase
      .channel("support-tickets-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => { fetchTickets(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetchTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectTicket = (ticket: Ticket) => {
    setActiveTicket(ticket);
    setShowNewForm(false);
    setMobileShowConversation(true);
  };

  const uploadAttachment = async (file: File): Promise<{ url: string; name: string } | null> => {
    const ext = file.name.split(".").pop() || "bin";
    const fileName = `support/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file, { upsert: true });
    if (error) { toast.error("Erreur upload : " + error.message); return null; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return { url: publicUrl, name: file.name };
  };

  const handleCreateTicket = async () => {
    if (!newSubject.trim() || !newFirstMessage.trim()) { toast.error("Sujet et message requis"); return; }
    setCreating(true);
    try {
      const { data: ticket, error } = await (supabase.from("support_tickets") as ReturnType<typeof supabase.from>)
        .insert({ user_id: userId, subject: newSubject, category: newCategory, priority: newPriority })
        .select()
        .single();
      if (error) throw error;

      const t = ticket as unknown as Ticket;

      // Upload attachment if any
      let attachmentData: { url: string; name: string } | null = null;
      if (attachment) {
        setUploading(true);
        attachmentData = await uploadAttachment(attachment);
        setUploading(false);
      }

      await (supabase.from("support_messages") as ReturnType<typeof supabase.from>)
        .insert({
          ticket_id: t.id, sender_id: userId, is_admin: false, message: newFirstMessage,
          attachment_url: attachmentData?.url || null,
          attachment_name: attachmentData?.name || null,
        });

      setNewSubject(""); setNewFirstMessage(""); setNewCategory("general"); setNewPriority("normal");
      setAttachment(null); setShowNewForm(false);
      await fetchTickets();
      selectTicket(t);
      toast.success("Ticket créé");
    } catch { toast.error("Erreur lors de la création"); }
    setCreating(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;
    if (!activeTicket) return;
    setSending(true);
    try {
      let attachmentData: { url: string; name: string } | null = null;
      if (attachment) {
        setUploading(true);
        attachmentData = await uploadAttachment(attachment);
        setUploading(false);
      }

      await (supabase.from("support_messages") as ReturnType<typeof supabase.from>)
        .insert({
          ticket_id: activeTicket.id, sender_id: userId, is_admin: false, message: newMessage || "(pièce jointe)",
          attachment_url: attachmentData?.url || null,
          attachment_name: attachmentData?.name || null,
        });
      setNewMessage(""); setAttachment(null);
      // Real-time handles the message append, but fetch as fallback
      await fetchMessages(activeTicket.id);
    } catch { toast.error("Erreur lors de l'envoi"); }
    setSending(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Fichier trop volumineux (max 10 Mo)"); return; }
    setAttachment(file);
    e.target.value = "";
  };

  // ── Ticket list panel ──
  const ticketListPanel = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brown/8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-dark">Support</h2>
          <Button size="sm" onClick={() => { setShowNewForm(true); setActiveTicket(null); setMobileShowConversation(true); }} className="h-8 rounded-lg bg-brand-primary text-white gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Nouveau
          </Button>
        </div>
        <p className="text-xs text-dark/40">{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-20"><Loader2 className="w-5 h-5 text-brand-accent animate-spin" /></div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <LifeBuoy className="w-8 h-8 text-dark/15 mx-auto mb-2" />
            <p className="text-xs text-dark/40">Aucun ticket</p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const statusConf = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
            const priorityConf = PRIORITIES.find((p) => p.value === ticket.priority);
            const isActive = activeTicket?.id === ticket.id && !showNewForm;
            const StatusIcon = ticket.status === "open" ? Clock : ticket.status === "resolved" ? CheckCircle : MessageCircle;
            return (
              <button
                key={ticket.id}
                onClick={() => selectTicket(ticket)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200",
                  isActive ? "bg-brand-accent/10 border border-brand-accent/20" : "hover:bg-brown/5 border border-transparent"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${statusConf.color}15` }}>
                  <StatusIcon className="h-3.5 w-3.5" style={{ color: statusConf.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-dark truncate">{ticket.subject}</p>
                    {ticket.priority === "urgent" && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                    {ticket.priority === "high" && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-dark/40 mt-0.5">
                    {CATEGORIES.find((c) => c.value === ticket.category)?.label} · {new Date(ticket.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConf.color }} />
                  {priorityConf && ticket.priority !== "normal" && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityConf.color }} />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // ── Right panel ──
  const rightPanel = () => {
    if (showNewForm) {
      return (
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setShowNewForm(false); setMobileShowConversation(false); }} className="lg:hidden p-2 rounded-xl text-dark/40 hover:text-dark hover:bg-brown/5">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-dark">Nouveau ticket</h2>
          </div>
          <div className="space-y-5 flex-1">
            <div>
              <label className="text-sm font-medium text-dark mb-2 block">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c.value} onClick={() => setNewCategory(c.value)} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all", newCategory === c.value ? "bg-brand-accent text-white" : "bg-brown/5 text-dark/50 hover:bg-brown/10")}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark mb-2 block">Priorité</label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => (
                  <button key={p.value} onClick={() => setNewPriority(p.value)} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all", newPriority === p.value ? "text-white" : "bg-brown/5 text-dark/50 hover:bg-brown/10")} style={newPriority === p.value ? { backgroundColor: p.color } : undefined}>
                    {p.value === "urgent" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark mb-2 block">Sujet</label>
              <Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Décrivez brièvement..." className="h-11" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark mb-2 block">Message</label>
              <textarea value={newFirstMessage} onChange={(e) => setNewFirstMessage(e.target.value)} placeholder="Détaillez votre demande..." rows={5} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30 resize-none" />
            </div>
            {/* Attachment */}
            <div>
              <label className="text-sm font-medium text-dark mb-2 block">Pièce jointe (optionnel)</label>
              {attachment ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brown/5 text-sm">
                  {attachment.type.startsWith("image/") ? <ImageIcon className="w-4 h-4 text-dark/40" /> : <FileText className="w-4 h-4 text-dark/40" />}
                  <span className="flex-1 truncate text-dark/70">{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} className="p-1 rounded hover:bg-brown/10"><X className="w-3.5 h-3.5 text-dark/40" /></button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-dark/40 hover:border-brand-accent hover:text-brand-accent transition-colors w-full">
                  <Paperclip className="w-4 h-4" />
                  Ajouter une image ou un PDF (max 10 Mo)
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>
          <Button onClick={handleCreateTicket} disabled={creating || uploading || !newSubject.trim() || !newFirstMessage.trim()} className="w-full h-11 rounded-xl bg-brand-primary text-white mt-4">
            {(creating || uploading) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Envoyer
          </Button>
        </div>
      );
    }

    if (activeTicket) {
      const statusConf = STATUS_CONFIG[activeTicket.status] || STATUS_CONFIG.open;
      const priorityConf = PRIORITIES.find((p) => p.value === activeTicket.priority);
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-brown/8">
            <button onClick={() => { setActiveTicket(null); setMobileShowConversation(false); }} className="lg:hidden p-2 rounded-xl text-dark/40 hover:text-dark hover:bg-brown/5">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-dark truncate">{activeTicket.subject}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-dark/40">{CATEGORIES.find((c) => c.value === activeTicket.category)?.label}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: `${statusConf.color}15`, color: statusConf.color }}>{statusConf.label}</span>
                {priorityConf && activeTicket.priority !== "normal" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: `${priorityConf.color}15`, color: priorityConf.color }}>
                    {activeTicket.priority === "urgent" && "🔴 "}{priorityConf.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.is_admin ? "justify-start" : "justify-end")}>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-3", msg.is_admin ? "bg-brown/5 text-dark" : "bg-brand-primary text-white")}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  {msg.attachment_url && msg.attachment_name && (
                    <AttachmentPreview url={msg.attachment_url} name={msg.attachment_name} />
                  )}
                  <p className={cn("text-[10px] mt-1.5", msg.is_admin ? "text-dark/30" : "text-white/50")}>
                    {msg.is_admin ? "Support IES" : "Vous"} · {new Date(msg.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {activeTicket.status !== "closed" && (
            <div className="p-4 border-t border-brown/8 space-y-2">
              {attachment && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brown/5 text-xs">
                  {attachment.type.startsWith("image/") ? <ImageIcon className="w-3.5 h-3.5 text-dark/40" /> : <FileText className="w-3.5 h-3.5 text-dark/40" />}
                  <span className="flex-1 truncate text-dark/60">{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} className="p-0.5 rounded hover:bg-brown/10"><X className="w-3 h-3 text-dark/40" /></button>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="h-11 w-11 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center text-dark/40 hover:text-brand-accent hover:border-brand-accent transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Votre message..." className="flex-1 h-11 rounded-xl" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                <Button onClick={handleSendMessage} disabled={sending || uploading || (!newMessage.trim() && !attachment)} className="h-11 px-5 rounded-xl bg-brand-primary text-white">
                  {(sending || uploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <LifeBuoy className="w-12 h-12 text-dark/10 mb-4" />
        <p className="text-dark/40 text-sm mb-1">Sélectionnez un ticket</p>
        <p className="text-dark/25 text-xs">ou créez-en un nouveau</p>
      </div>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-10rem)] flex rounded-2xl bg-white overflow-hidden border border-brown/8">
      <div className={cn("w-full lg:w-80 lg:shrink-0 lg:border-r lg:border-brown/8 lg:block", mobileShowConversation ? "hidden" : "block")}>
        {ticketListPanel}
      </div>
      <div className={cn("w-full lg:flex-1 lg:block", mobileShowConversation ? "block" : "hidden lg:block")}>
        {rightPanel()}
      </div>
    </div>
  );
}
