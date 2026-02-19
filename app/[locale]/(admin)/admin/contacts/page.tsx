import { createClient } from "@/lib/supabase/server";
import { ContactsAdmin } from "@/components/admin/ContactsAdmin";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const supabase = await createClient();

  const { data: rawContacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const contacts = (rawContacts || []) as any[];

  return <ContactsAdmin initialContacts={contacts} />;
}
