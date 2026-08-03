"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { useIdentity } from "@/lib/identity";
import { PersonAvatar } from "./PersonAvatar";
import { WhoAreYouModal } from "./WhoAreYouModal";
import { AddTimeOffModal } from "./AddTimeOffModal";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
  { href: "/team", label: "Team" },
  { href: "/my", label: "My Time Off" },
];

export function TopBar() {
  const pathname = usePathname();
  const { employee } = useIdentity();
  const [whoAreYouOpen, setWhoAreYouOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-bg-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo-white.png" alt="Fit Factory" width={143} height={28} className="h-6 w-auto sm:h-7" />
            <span className="hidden text-sm font-semibold text-white sm:inline border-l border-bg-border pl-3">
              Vacation Tracker
            </span>
          </Link>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition",
                    active
                      ? "bg-bg-card text-white"
                      : "text-slate-400 hover:bg-bg-card hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setAddOpen(true)}
            className="hidden rounded-lg bg-brand-amber px-3 py-1.5 text-sm font-semibold text-bg transition hover:bg-amber-400 sm:inline-block"
          >
            + Add time off
          </button>

          <button
            onClick={() => setWhoAreYouOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-bg-border bg-bg-card px-2 py-1.5 text-sm text-white transition hover:border-brand-amber/40"
          >
            {employee ? (
              <>
                <PersonAvatar employee={employee} size="sm" />
                <span className="hidden sm:inline">{employee.name}</span>
              </>
            ) : (
              <span className="text-slate-400">Who are you?</span>
            )}
          </button>
        </div>
      </header>

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-amber text-bg shadow-lg shadow-black/40 transition hover:bg-amber-400 sm:hidden"
        aria-label="Add time off"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </button>

      <WhoAreYouModal open={whoAreYouOpen} onClose={() => setWhoAreYouOpen(false)} />
      <AddTimeOffModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
