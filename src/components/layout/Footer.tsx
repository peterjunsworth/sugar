'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-8 px-4"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--surface-border)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Links */}
          <div className="flex gap-6 text-sm">
            <Link
              href="/about"
              className="hover:underline"
              style={{ color: 'var(--muted-foreground)' }}
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="hover:underline"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:underline"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:underline"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            &copy; {currentYear} Sugar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
