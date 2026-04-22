"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  {
    section: "Manage",
    items: [
      { href: "/proposals", label: "Proposals", icon: InboxIcon },
    ],
  },
];

export function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-60 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="px-5 pt-5 pb-6">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[color:var(--color-accent)] text-white text-xs font-bold">
            C
          </span>
          Crystallise
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-6">
        {NAV.map((section) => (
          <div key={section.section}>
            <h3 className="px-2 mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-text-subtle)]">
              {section.section}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={[
                        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-[color:var(--color-surface-raised)] text-[color:var(--color-text)] shadow-sm"
                          : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-raised)]/60",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-[color:var(--color-border)] p-3 space-y-2">
        <div className="flex items-center justify-between px-1.5">
          <div className="min-w-0 flex-1">
            {userEmail && (
              <p
                className="truncate text-xs text-[color:var(--color-text-muted)]"
                title={userEmail}
              >
                {userEmail}
              </p>
            )}
          </div>
          <ThemeToggle />
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-raised)] transition-colors inline-flex items-center gap-2.5"
          >
            <SignOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function SignOutIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
