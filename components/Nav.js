"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Nav({ site }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3"
      >
        <Link href="/" className="flex items-center gap-3">
          <Logo size={40} />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-tight">
              {site.shortName}
              <span className="ml-1.5 text-xs font-normal italic text-muted">
                {site.collective}
              </span>
            </span>
            <span className="block text-[11px] text-muted">{site.department}</span>
          </span>
        </Link>

        <ul className="hidden gap-1 lg:flex">
          {site.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? "border border-line bg-surface text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="rounded-card border border-line px-3 py-1.5 text-sm lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-line px-5 pb-5 lg:hidden">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
