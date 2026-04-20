'use client';

import { profile } from '@/data/profile';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-[var(--muted)]">
          © {year} {profile.name}
        </p>
        <div className="flex items-center gap-6">
          {profile.contact.links.map((link) =>
            link.active ? (
              <a
                key={link.label}
                href={link.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors no-underline"
              >
                {link.label}
              </a>
            ) : (
              <span key={link.label} className="font-mono text-[11px] text-[var(--muted)] opacity-30 cursor-not-allowed">
                {link.label}
              </span>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
