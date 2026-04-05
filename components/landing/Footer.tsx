import Link from "next/link";
import { Github, Twitter } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#09090B]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-lg font-bold text-[var(--lf-text-primary)]"
        >
          LinkForge
        </Link>

        {/* Nav */}
        <nav className="flex gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--lf-text-secondary)] transition-colors hover:text-[var(--lf-text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--lf-text-secondary)] transition-colors hover:text-[var(--lf-text-primary)]"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--lf-text-secondary)] transition-colors hover:text-[var(--lf-text-primary)]"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="border-t border-[#27272A] py-4 text-center text-xs text-[var(--lf-text-secondary)]">
        &copy; 2026 LinkForge. Built with &#9829;
      </div>
    </footer>
  );
}
