"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LifeBuoy,
  Send,
  ArrowLeft,
  Clock,
  CheckCircle,
  Loader2,
  MessageCircle,
  XCircle,
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
  user_id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null; email: string | null; company: string | null };
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

const CATEGORIES: Record<string, string> = { general: "Général", commande: "Commande", facturation: "Facturation", technique: "Technique" };

const PRIORITIES: Record<string, { label: string; color: string }> = {
  low: { label: "Basse", color: "#6B7280" },
  normal: { label: "Normale", color: "#3B82F6" },
  high: { label: "Haute", color: "#F59E0B" },
  urgent: { label: "Urgente", color: "#EF4444" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: "Ouvert", color: "#F59E0B" },
  in_progress: { label: "En cours", color: "#3B82F6" },
  resolved: { label: "Résolu", color: "#10B981" },
  closed: { label: "Fermé", color: "#6B7280" },
};

const STATUS_FLOW = ["open", "in_progress", "resolved", "closed"];

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

export default function AdminSupportPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("all");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mobileShowConversation, setMobileShowConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTickets = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from("support_tickets") as any)
      .select("*, profiles(full_name, email, company)")
      .order("updated_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    if (data) setTickets(data);
    setLoading(false);
  }, [supabase, filter]);

  const fetchMessages = useCallback(async (ticketId: string) => {
    const { data } = await (supabase.from("support_messages") as ReturnType<typeof supabase.from>)
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as unknown as Message[]);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, [supabase]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  useEffect(() => {
    if (activeTicket) fetchMessages(activeTicket.id);
    else setMessages([]);
  }, [activeTicket, fetchMessages]);

  // Real-time messages
  useEffect(() => {
    if (!activeTicket) return;
    const channel = supabase
      .channel(`admin-support-messages-${activeTicket.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages", filter: `ticket_id=eq.${activeTicket.id}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]);
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeTicket, supabase]);

  // Real-time tickets
  useEffect(() => {
    const channel = supabase
      .channel("admin-support-tickets")
      .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, () => { fetchTickets(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetchTickets]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const selectTicket = (ticket: Ticket) => { setActiveTicket(ticket); setMobileShowConversation(true); };

  const uploadAttachment = async (file: File): Promise<{ url: string; name: string } | null> => {
    const ext = file.name.split(".").pop() || "bin";
    const fileName = `support/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file, { upsert: true });
    if (error) { toast.error("Erreur upload : " + error.message); return null; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return { url: publicUrl, name: file.name };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;
    if (!activeTicket) return;
    setSending(true);
    try {
      let attachmentData: { url: string; name: string } | null = null;
      if (attachment) { setUploading(true); attachmentData = await uploadAttachment(attachment); setUploading(false); }

      await (supabase.from("support_messages") as ReturnType<typeof supabase.from>)
        .insert({
          ticket_id: activeTicket.id, sender_id: userId, is_admin: true, message: newMessage || "(pièce jointe)",
          attachment_url: attachmentData?.url || null, attachment_name: attachmentData?.name || null,
        });
      setNewMessage(""); setAttachment(null);
      await fetchMessages(activeTicket.id);

      if (activeTicket.status === "open") {
        await (supabase.from("support_tickets") as ReturnType<typeof supabase.from>).update({ status: "in_progress" }).eq("id", activeTicket.id);
        setActiveTicket({ ...activeTicket, status: "in_progress" });
        fetchTickets();
      }
    } catch { toast.error("Erreur lors de l'envoi"); }
    setSending(false);
  };

  const handleChangeStatus = async (status: string) => {
    if (!activeTicket) return;
    await (supabase.from("support_tickets") as ReturnType<typeof supabase.from>).update({ status }).eq("id", activeTicket.id);
    setActiveTicket({ ...activeTicket, status });
    fetchTickets();
    toast.success(`Ticket → ${STATUS_CONFIG[status].label}`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Max 10 Mo"); return; }
    setAttachment(file);
    e.target.value = "";
  };

  const openCount = tickets.filter((t) => t.status === "open").length;
  const urgentCount = tickets.filter((t) => t.priority === "urgent" && t.status !== "closed").length;

  // ── Left panel ──
  const ticketListPanel = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-brand-primary/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-brand-primary">Support</h2>
          <div className="flex items-center gap-1.5">
            {urgentCount > 0 && (
              <span className="flex h-6 items-center gap-1 px-2 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />{urgentCount}
              </span>
            )}
            {openCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-white text-xs font-bold">{openCount}</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setFilter("all")} className={cn("px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors", filter === "all" ? "bg-brand-primary text-white" : "text-brand-secondary/50 hover:bg-brand-primary/5")}>Tous</button>
          {STATUS_FLOW.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={cn("px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors", filter === s ? "bg-brand-primary text-white" : "text-brand-secondary/50 hover:bg-brand-primary/5")}>{STATUS_CONFIG[s].label}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-20"><Loader2 className="w-5 h-5 text-brand-accent animate-spin" /></div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8"><LifeBuoy className="w-8 h-8 text-brand-secondary/20 mx-auto mb-2" /><p className="text-xs text-brand-secondary/40">Aucun ticket</p></div>
        ) : (
          tickets.map((ticket) => {
            const statusConf = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
            const priorityConf = PRIORITIES[ticket.priority];
            const isActive = activeTicket?.id === ticket.id;
            const StatusIcon = ticket.status === "open" ? Clock : ticket.status === "closed" ? XCircle : ticket.status === "resolved" ? CheckCircle : MessageCircle;
            const clientName = ticket.profiles?.full_name || ticket.profiles?.email || "Client";
            return (
              <button key={ticket.id} onClick={() => selectTicket(ticket)} className={cn("w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200", isActive ? "bg-brand-accent/[0.08] border border-brand-accent/20" : "hover:bg-brand-primary/[0.03] border border-transparent")}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${statusConf.color}15` }}>
                  <StatusIcon className="h-3.5 w-3.5" style={{ color: statusConf.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-brand-primary truncate">{ticket.subject}</p>
                    {ticket.priority === "urgent" && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                    {ticket.priority === "high" && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-brand-secondary/40 mt-0.5 truncate">{clientName} · {CATEGORIES[ticket.category]}</p>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConf.color }} />
                  {priorityConf && ticket.priority !== "normal" && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityConf.color }} />}
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
    if (activeTicket) {
      const statusConf = STATUS_CONFIG[activeTicket.status] || STATUS_CONFIG.open;
      const priorityConf = PRIORITIES[activeTicket.priority];
      const clientName = activeTicket.profiles?.full_name || activeTicket.profiles?.email || "Client";
      const clientCompany = activeTicket.profiles?.company || "";

      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-primary/[0.06]">
            <button onClick={() => { setActiveTicket(null); setMobileShowConversation(false); }} className="lg:hidden p-2 rounded-xl text-brand-secondary/40 hover:text-brand-primary hover:bg-brand-primary/5"><ArrowLeft className="w-5 h-5" /></button>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-brand-primary truncate">{activeTicket.subject}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[11px] text-brand-secondary/40">{clientName}{clientCompany && ` · ${clientCompany}`}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: `${statusConf.color}15`, color: statusConf.color }}>{statusConf.label}</span>
                {priorityConf && activeTicket.priority !== "normal" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: `${priorityConf.color}15`, color: priorityConf.color }}>
                    {activeTicket.priority === "urgent" && "🔴 "}{priorityConf.label}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {STATUS_FLOW.map((s) => {
                const conf = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={() => handleChangeStatus(s)} className={cn("px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all", activeTicket.status === s ? "ring-1 ring-offset-1" : "opacity-40 hover:opacity-100")} style={{ backgroundColor: `${conf.color}15`, color: conf.color }}>{conf.label}</button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.is_admin ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-3", msg.is_admin ? "bg-brand-primary text-white" : "bg-brand-primary/5 text-brand-primary")}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  {msg.attachment_url && msg.attachment_name && <AttachmentPreview url={msg.attachment_url} name={msg.attachment_name} />}
                  <p className={cn("text-[10px] mt-1.5", msg.is_admin ? "text-white/50" : "text-brand-secondary/40")}>
                    {msg.is_admin ? "Vous" : clientName} · {new Date(msg.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-brand-primary/[0.06] space-y-2">
            {attachment && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-primary/5 text-xs">
                {attachment.type.startsWith("image/") ? <ImageIcon className="w-3.5 h-3.5 text-brand-secondary/40" /> : <FileText className="w-3.5 h-3.5 text-brand-secondary/40" />}
                <span className="flex-1 truncate text-brand-secondary/60">{attachment.name}</span>
                <button onClick={() => setAttachment(null)} className="p-0.5 rounded hover:bg-brand-primary/10"><X className="w-3 h-3 text-brand-secondary/40" /></button>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="h-11 w-11 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center text-brand-secondary/40 hover:text-brand-accent hover:border-brand-accent transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Répondre au client..." className="flex-1 h-11 rounded-xl" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
              <Button onClick={handleSendMessage} disabled={sending || uploading || (!newMessage.trim() && !attachment)} className="h-11 px-5 rounded-xl bg-brand-accent text-white hover:bg-brand-accent-hover">
                {(sending || uploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileSelect} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <LifeBuoy className="w-12 h-12 text-brand-secondary/10 mb-4" />
        <p className="text-brand-secondary/40 text-sm mb-1">Sélectionnez un ticket</p>
        <p className="text-brand-secondary/25 text-xs">pour voir la conversation</p>
      </div>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-10rem)] flex rounded-2xl bg-white overflow-hidden border border-brand-primary/[0.06]">
      <div className={cn("w-full lg:w-80 lg:shrink-0 lg:border-r lg:border-brand-primary/[0.06] lg:block", mobileShowConversation ? "hidden" : "block")}>{ticketListPanel}</div>
      <div className={cn("w-full lg:flex-1 lg:block", mobileShowConversation ? "block" : "hidden lg:block")}>{rightPanel()}</div>
    </div>
  );
}
