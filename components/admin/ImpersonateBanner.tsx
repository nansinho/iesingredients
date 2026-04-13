"use client";

import { useState } from "react";
import { Eye, X, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";

interface ImpersonateBannerProps {
  userName: string;
  userEmail: string;
  userCompany?: string | null;
}

export function ImpersonateBanner({ userName, userEmail, userCompany }: ImpersonateBannerProps) {
  const [stopping, setStopping] = useState(false);
  const router = useRouter();

  const handleStop = async () => {
    setStopping(true);
    await fetch("/api/admin/impersonate", { method: "DELETE" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push("/admin/utilisateurs" as any);
    router.refresh();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-white">
      <div className="flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium">
        <Eye className="w-4 h-4 shrink-0" />
        <span>
          Vue en tant que <strong>{userName}</strong>
          {userCompany && <span className="opacity-80"> ({userCompany})</span>}
          <span className="opacity-60 ml-1">— {userEmail}</span>
        </span>
        <button
          onClick={handleStop}
          disabled={stopping}
          className="ml-2 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-xs font-bold"
        >
          {stopping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Arrêter
        </button>
      </div>
    </div>
  );
}
