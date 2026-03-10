"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Mail, Phone, Linkedin, Users, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEPARTMENTS, getDepartmentLabel } from "@/lib/constants/departments";

interface TeamMember {
  id: string;
  name: string;
  role_fr: string;
  role_en: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  department: string | null;
  display_order: number | null;
}

interface TeamPageClientProps {
  members: TeamMember[];
  locale: string;
}

export function TeamPageClient({ members, locale }: TeamPageClientProps) {
  const [activeDepartment, setActiveDepartment] = useState<string>("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isFr = locale === "fr";

  const activeDepartments = useMemo(() => {
    const deptCounts = new Map<string, number>();
    members.forEach((m) => {
      if (m.department) {
        deptCounts.set(m.department, (deptCounts.get(m.department) || 0) + 1);
      }
    });
    return DEPARTMENTS.filter((d) => deptCounts.has(d.id)).map((d) => ({
      ...d,
      count: deptCounts.get(d.id) || 0,
    }));
  }, [members]);

  // Group members by department for "all" view
  const groupedMembers = useMemo(() => {
    if (activeDepartment !== "all") {
      return [
        {
          deptId: activeDepartment,
          label: getDepartmentLabel(activeDepartment, locale),
          members: members.filter((m) => m.department === activeDepartment),
        },
      ];
    }
    return activeDepartments.map((dept) => ({
      deptId: dept.id,
      label: isFr ? dept.labelFr : dept.labelEn,
      members: members.filter((m) => m.department === dept.id),
    }));
  }, [members, activeDepartment, activeDepartments, isFr, locale]);

  const activeLabel =
    activeDepartment === "all"
      ? isFr
        ? "Tous les services"
        : "All departments"
      : getDepartmentLabel(activeDepartment, locale);

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-dark">
      <div className="w-[94%] max-w-7xl mx-auto">
        {/* Department selector — dropdown on mobile, horizontal tabs on desktop */}
        <div className="mb-10">
          <p className="text-sm font-medium text-dark/40 dark:text-cream-light/40 uppercase tracking-wider mb-3">
            {isFr ? "Quel service vous intéresse ?" : "Which department interests you?"}
          </p>

          {/* Mobile dropdown */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-dark/10 dark:border-white/10 bg-white dark:bg-dark-card text-dark dark:text-cream-light text-sm font-medium"
            >
              {activeLabel}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  mobileOpen && "rotate-180"
                )}
              />
            </button>
            {mobileOpen && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white dark:bg-dark-card border border-dark/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    setActiveDepartment("all");
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                    activeDepartment === "all"
                      ? "bg-[var(--brand-primary)] text-white"
                      : "text-dark dark:text-cream-light hover:bg-cream dark:hover:bg-dark-lighter"
                  )}
                >
                  <Users className="w-3.5 h-3.5 inline mr-2" />
                  {isFr ? "Tous les services" : "All departments"} ({members.length})
                </button>
                {activeDepartments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setActiveDepartment(dept.id);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors",
                      activeDepartment === dept.id
                        ? "bg-[var(--brand-primary)] text-white"
                        : "text-dark dark:text-cream-light hover:bg-cream dark:hover:bg-dark-lighter"
                    )}
                  >
                    {isFr ? dept.labelFr : dept.labelEn} ({dept.count})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop horizontal tabs */}
          <div className="hidden md:flex flex-wrap gap-2">
            <button
              onClick={() => setActiveDepartment("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                activeDepartment === "all"
                  ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                  : "bg-white dark:bg-dark-card text-dark/60 dark:text-cream-light/60 border-dark/10 dark:border-white/10 hover:border-[var(--brand-accent)]/40 hover:text-dark dark:hover:text-cream-light"
              )}
            >
              <Users className="w-3.5 h-3.5 inline mr-1.5" />
              {isFr ? "Tous" : "All"}
              <span className="ml-1 text-xs opacity-70">({members.length})</span>
            </button>
            {activeDepartments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveDepartment(dept.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  activeDepartment === dept.id
                    ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                    : "bg-white dark:bg-dark-card text-dark/60 dark:text-cream-light/60 border-dark/10 dark:border-white/10 hover:border-[var(--brand-accent)]/40 hover:text-dark dark:hover:text-cream-light"
                )}
              >
                {isFr ? dept.labelFr : dept.labelEn}
                <span className="ml-1 text-xs opacity-70">({dept.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Members grouped by department */}
        <div className="space-y-14">
          {groupedMembers.map((group) => (
            <div key={group.deptId}>
              {/* Department heading (only in "all" view) */}
              {activeDepartment === "all" && (
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-lg font-semibold text-dark dark:text-cream-light">
                    {group.label}
                  </h3>
                  <span className="text-xs font-medium text-dark/30 dark:text-cream-light/30 bg-dark/5 dark:bg-white/8 px-2 py-0.5 rounded-full">
                    {group.members.length}
                  </span>
                  <div className="flex-1 h-px bg-dark/6 dark:bg-white/8" />
                </div>
              )}

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {group.members.map((member) => (
                  <TeamCard key={member.id} member={member} locale={locale} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dark/50 dark:text-cream-light/50">
              {isFr ? "Aucun membre trouvé." : "No members found."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function TeamCard({
  member,
  locale,
}: {
  member: TeamMember;
  locale: string;
}) {
  const isFr = locale === "fr";
  const role = isFr ? member.role_fr : member.role_en || member.role_fr;

  // Generate initials from name
  const initials = member.name
    .split(" ")
    .filter((part) => part === part.toUpperCase() && part.length > 1)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
  const displayInitials = initials || member.name.charAt(0);

  return (
    <div className="group rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-dark/6 dark:border-white/8 hover:border-[var(--brand-accent)]/20 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
      {/* Photo */}
      <div className="p-2.5 pb-0">
        <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-cream dark:bg-dark">
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-accent-light)]/20">
              <span className="text-4xl font-semibold text-[var(--brand-primary)]/25 dark:text-cream-light/20 select-none">
                {displayInitials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-4">
        <h3 className="font-semibold text-base text-dark dark:text-cream-light leading-tight">
          {member.name}
        </h3>
        <p className="text-[var(--brand-accent)] dark:text-[var(--brand-accent-light)] text-sm mt-0.5 font-medium leading-snug">
          {role}
        </p>

        {/* Contact info — displayed as text, not just icons */}
        {(member.email || member.phone) && (
          <div className="mt-3 pt-3 border-t border-dark/6 dark:border-white/8 space-y-1.5">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-dark/50 dark:text-cream-light/50 hover:text-[var(--brand-accent)] dark:hover:text-[var(--brand-accent-light)] transition-colors duration-200 text-xs"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{member.email}</span>
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-dark/50 dark:text-cream-light/50 hover:text-[var(--brand-accent)] dark:hover:text-[var(--brand-accent-light)] transition-colors duration-200 text-xs"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{member.phone}</span>
              </a>
            )}
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-dark/50 dark:text-cream-light/50 hover:text-[#0A66C2] transition-colors duration-200 text-xs"
              >
                <Linkedin className="w-3.5 h-3.5 shrink-0" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
