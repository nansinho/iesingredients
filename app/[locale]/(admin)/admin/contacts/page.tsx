import { createClient } from "@/lib/supabase/server";
import { ContactsAdmin } from "@/components/admin/ContactsAdmin";

export default async function ContactsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let contacts: any[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id, status, first_name, last_name, email, subject, message, company, phone, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Failed to fetch contacts:", error.message);
    } else {
      contacts = data ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
  }

  return <ContactsAdmin initialContacts={contacts} />;
}
