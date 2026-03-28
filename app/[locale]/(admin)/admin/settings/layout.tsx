import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsNav } from "@/components/admin/SettingsNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminPageHeader
        title="Paramètres"
        subtitle="Configuration de la plateforme"
      />

      <div className="flex gap-8">
        {/* Sidebar navigation */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-6">
            <SettingsNav />
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full mb-4">
          <SettingsNav />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {children}
        </div>
      </div>
    </>
  );
}
