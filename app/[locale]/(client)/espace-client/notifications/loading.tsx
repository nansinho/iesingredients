import { Loader2 } from "lucide-react";

export default function NotificationsLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-brand-accent animate-spin" />
    </div>
  );
}
