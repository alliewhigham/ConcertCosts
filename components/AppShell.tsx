"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Music, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeSelector } from "./ThemeSelector";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add", label: "Add Concert", icon: PlusCircle },
  { href: "/concerts", label: "My Concerts", icon: Music },
] as const;

type AppShellProps = {
  email: string;
  children: React.ReactNode;
};

export function AppShell({ email, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="border-b border-base-300 bg-base-100/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                Concert Cost Tracker
              </h1>
              <p className="text-sm opacity-70 mt-1 max-w-xl">
                See what each show really costs — and which ones were worth every dollar.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <span className="badge badge-ghost badge-lg max-w-[14rem] truncate" title={email}>
                {email}
              </span>
              <ThemeSelector compact />
              <button type="button" className="btn btn-outline btn-sm gap-1" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden />
                Log out
              </button>
            </div>
          </div>

          <nav className="tabs tabs-box bg-base-200 p-1 w-full sm:w-fit overflow-x-auto">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`tab gap-1.5 whitespace-nowrap ${active ? "tab-active" : ""}`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
