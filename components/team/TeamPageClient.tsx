"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Mail, Phone, Linkedin, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  const isFr = locale === "fr";

  // Get departments that have members
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

  const filtered = useMemo(() => {
    if (!activeDepartment) return members;
    return members.filter((m) => m.department === activeDepartment);
  }, [members, activeDepartment]);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-dark">
      <div className="w-[94%] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <h2 className="text-dark dark:text-cream-light tracking-tight">
            {isFr ? "Rencontrez nos" : "Meet our"}{" "}
            <span className="font-playfair italic text-[var(--brand-accent)]">
              {isFr ? "Experts" : "Experts"}
            </span>
          </h2>
          <p className="text-dark/50 dark:text-cream-light/50 mt-3 text-base max-w-lg mx-auto">
            {isFr
              ? "Chaque membre apporte une expertise unique au service de vos projets."
              : "Each member brings unique expertise to serve your projects."}
          </p>
        </motion.div>

        {/* Filter pills */}
        {activeDepartments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
          >
            <button
              onClick={() => setActiveDepartment(null)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                !activeDepartment
                  ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-md"
                  : "bg-white dark:bg-dark-card text-dark/50 dark:text-cream-light/50 border-dark/10 dark:border-white/10 hover:border-[var(--brand-accent)]/30 hover:text-dark dark:hover:text-cream-light"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              {isFr ? "Tous" : "All"}
              <span className="text-xs opacity-60">({members.length})</span>
            </button>

            {activeDepartments.map((dept) => (
              <button
                key={dept.id}
                onClick={() =>
                  setActiveDepartment(activeDepartment === dept.id ? null : dept.id)
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                  activeDepartment === dept.id
                    ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-md"
                    : "bg-white dark:bg-dark-card text-dark/50 dark:text-cream-light/50 border-dark/10 dark:border-white/10 hover:border-[var(--brand-accent)]/30 hover:text-dark dark:hover:text-cream-light"
                )}
              >
                {isFr ? dept.labelFr : dept.labelEn}
                <span className="text-xs opacity-60">({dept.count})</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Team grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDepartment || "all"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                locale={locale}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dark/50 dark:text-cream-light/50">
              {isFr
                ? "Aucun membre trouvé dans ce département."
                : "No members found in this department."}
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
  index,
}: {
  member: TeamMember;
  locale: string;
  index: number;
}) {
  const isFr = locale === "fr";
  const role = isFr
    ? member.role_fr
    : member.role_en || member.role_fr;

  const hasContactInfo = member.email || member.phone || member.linkedin_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-dark-card border border-dark/6 dark:border-white/8 hover:border-[var(--brand-accent)]/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-1">
        {/* Photo */}
        <div className="p-2.5 pb-0">
          <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-cream dark:bg-dark">
            {member.photo_url ? (
              <Image
                src={member.photo_url}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--brand-primary)]/8 to-[var(--brand-accent-light)]/15">
                <span className="text-5xl font-playfair italic text-[var(--brand-primary)]/20 dark:text-cream-light/20">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Info */}
        <div className="px-4 pt-3 pb-4">
          <h3 className="font-semibold text-lg text-dark dark:text-cream-light leading-tight">
            {member.name}
          </h3>
          <p className="text-[var(--brand-accent)] dark:text-[var(--brand-accent-light)] text-sm mt-0.5 font-medium">
            {role}
          </p>

          {/* Department badge */}
          {member.department && (
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[11px] font-medium uppercase tracking-wider bg-[var(--brand-primary)]/6 dark:bg-white/8 text-[var(--brand-primary)]/70 dark:text-cream-light/50">
              {getDepartmentLabel(member.department, locale)}
            </span>
          )}

          {/* Contact icons */}
          {hasContactInfo && (
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-dark/6 dark:border-white/8">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 rounded-lg text-dark/30 dark:text-cream-light/30 hover:text-[var(--brand-accent)] dark:hover:text-[var(--brand-accent-light)] hover:bg-[var(--brand-accent)]/8 transition-all duration-200"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="w-[18px] h-[18px]" />
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="p-2 rounded-lg text-dark/30 dark:text-cream-light/30 hover:text-[var(--brand-accent)] dark:hover:text-[var(--brand-accent-light)] hover:bg-[var(--brand-accent)]/8 transition-all duration-200"
                  aria-label={`${isFr ? "Appeler" : "Call"} ${member.name}`}
                >
                  <Phone className="w-[18px] h-[18px]" />
                </a>
              )}
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-dark/30 dark:text-cream-light/30 hover:text-[#0A66C2] hover:bg-[#0A66C2]/8 transition-all duration-200"
                  aria-label={`LinkedIn ${member.name}`}
                >
                  <Linkedin className="w-[18px] h-[18px]" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
