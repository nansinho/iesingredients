"use client";

import { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { ClientSidebar } from "./ClientSidebar";
import { ClientHeader } from "./ClientHeader";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

interface ClientProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export function ClientShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: ClientProfile;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-[#F8F7F5]">
        <ClientSidebar />
        <main
          className={cn(
            "flex-1 min-h-screen flex flex-col transition-all duration-300",
            collapsed ? "lg:ml-16" : "lg:ml-64"
          )}
        >
          <ClientHeader profile={profile} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
