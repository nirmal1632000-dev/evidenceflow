"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeProvider";

const links = [
  { href: "/workspace", label: "Workspace" },
  { href: "/example/tour", label: "Watch tour" },
  { href: "/guide", label: "How-to" },
  { href: "/auth", label: "Sign in" },
  { href: "/learn", label: "Learn" },
  { href: "/example", label: "Example" },
  { href: "/tools", label: "Software modules" },
  { href: "/tools/calculator", label: "MA calc" },
  { href: "/glossary", label: "Glossary" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm text-white shadow-sm">
            EF
          </span>
          <span className="hidden sm:inline">EvidenceFlow</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2 py-1.5 whitespace-nowrap transition-colors ${
                  active
                    ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle className="ml-1" />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href + "/"));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm ${
                      active
                        ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
