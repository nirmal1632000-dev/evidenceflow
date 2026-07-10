"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeProvider";

/** Primary desktop links — keep short to avoid clutter */
const primaryLinks = [
  { href: "/designs", label: "Designs" },
  { href: "/workspace", label: "SR / MA" },
  { href: "/learn", label: "Learn" },
  { href: "/tools", label: "Software" },
  { href: "/guide", label: "How-to" },
];

const moreLinks = [
  { href: "/designs/chooser", label: "Design chooser" },
  { href: "/designs/case-report", label: "Case report track" },
  { href: "/example/tour", label: "SR watch tour" },
  { href: "/example", label: "SR example" },
  { href: "/learn/foundations/history", label: "History" },
  { href: "/tools/calculator", label: "MA calculator" },
  { href: "/glossary", label: "Glossary" },
  { href: "/auth", label: "Sign in" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-2 px-3 sm:h-14 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-sm text-white shadow-sm">
            EF
          </span>
          <span className="truncate text-sm sm:text-base">EvidenceFlow</span>
        </Link>

        {/* Desktop primary */}
        <nav className="hidden items-center gap-0.5 text-sm md:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-2.5 py-1.5 whitespace-nowrap transition-colors ${
                isActive(link.href)
                  ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              More
            </summary>
            <div className="absolute right-0 z-50 mt-1 min-w-[12rem] rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
          <ThemeToggle className="ml-1" />
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="max-h-[70vh] overflow-y-auto border-t border-slate-100 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Main
          </p>
          <ul className="flex flex-col gap-0.5">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm ${
                    isActive(link.href)
                      ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            More
          </p>
          <ul className="flex flex-col gap-0.5 pb-2">
            {moreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
