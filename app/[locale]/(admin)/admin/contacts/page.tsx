import { createClient } from "@/lib/supabase/server";
import { ContactsAdmin } from "@/components/admin/ContactsAdmin";

export default async function ContactsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let contacts: any[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

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
