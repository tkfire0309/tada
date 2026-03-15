"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          tada
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <Link href="/pricing" className="hover:text-foreground transition">
            料金
          </Link>
          <Link href="/about" className="hover:text-foreground transition">
            about
          </Link>
          <Link
            href="/"
            className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition"
          >
            ログイン
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-foreground"
          >
            {menuOpen ? (
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path
                  d="M3 5H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 10H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 15H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3 text-sm">
          <Link
            href="/pricing"
            className="text-muted hover:text-foreground transition"
            onClick={() => setMenuOpen(false)}
          >
            料金
          </Link>
          <Link
            href="/about"
            className="text-muted hover:text-foreground transition"
            onClick={() => setMenuOpen(false)}
          >
            about
          </Link>
          <Link
            href="/"
            className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition text-center"
            onClick={() => setMenuOpen(false)}
          >
            ログイン
          </Link>
        </nav>
      )}
    </header>
  );
}
