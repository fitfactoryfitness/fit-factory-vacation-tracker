"use client";

import type { ReactNode } from "react";
import { IdentityProvider } from "@/lib/identity";
import { TimeOffProvider } from "@/lib/timeoff-client";
import { TopBar } from "./TopBar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <IdentityProvider>
      <TimeOffProvider>
        <TopBar />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
      </TimeOffProvider>
    </IdentityProvider>
  );
}
