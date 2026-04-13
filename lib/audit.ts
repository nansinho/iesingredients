import { createClient } from "@/lib/supabase/server";

interface AuditParams {
  action: "create" | "update" | "delete";
  entityType: string;
  entityId: string;
  entityLabel?: string;
  details?: Record<string, unknown>;
}

export async function logAudit(params: AuditParams) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("audit_logs") as any).insert({
      user_id: user.id,
      user_email: user.email || "",
      user_name: user.user_metadata?.full_name || user.email || "",
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      entity_label: params.entityLabel || null,
      details: params.details || null,
    });
  } catch {
    // Silencieux — ne bloque jamais l'action principale
  }
}
