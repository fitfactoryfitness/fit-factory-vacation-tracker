"use client";

import type { ReactNode } from "react";
import { EmployeesProvider } from "@/lib/employees-client";
import { IdentityProvider } from "@/lib/identity";
import { TimeOffProvider } from "@/lib/timeoff-client";
import { TopBar } from "./TopBar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <EmployeesProvider>
      <IdentityProvider>
        <TimeOffProvider>
          <TopBar />
          <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:pb-6">{children}</main>
        </TimeOffProvider>
      </IdentityProvider>
    </EmployeesProvider>
  );
}
