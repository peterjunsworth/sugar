'use client';

import Link from 'next/link';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-8 px-6"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--surface-border)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--p-primary-500)' }}
            >
              S
            </div>
            <span
              className="text-xl font-bold"
              style={{ color: 'var(--foreground)' }}
            >
              Sugar
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/about"
              className="hover:underline transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="hover:underline transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:underline transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:underline transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Contact
            </Link>
            <Link
              href="/help"
              className="hover:underline transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Help
            </Link>
          </div>

          {/* Social Links (placeholders) */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'var(--surface-hover)',
                color: 'var(--muted-foreground)',
              }}
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'var(--surface-hover)',
                color: 'var(--muted-foreground)',
              }}
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
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
