'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, var(--p-primary-600), var(--p-primary-400))',
        }}
      >
        {/* Gradient Blobs */}
        <div
          className="absolute rounded-full blur-[80px] opacity-40"
          style={{
            width: '400px',
            height: '400px',
            background: 'var(--accent-purple-500)',
            top: '-100px',
            right: '-100px',
          }}
        />
        <div
          className="absolute rounded-full blur-[80px] opacity-40"
          style={{
            width: '350px',
            height: '350px',
            background: 'var(--accent-coral-500)',
            bottom: '-100px',
            left: '-100px',
          }}
        />
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[480px] relative z-10">
        <div
          className="rounded-2xl shadow-2xl p-8 backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--surface-border)',
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-[var(--p-primary-500)] flex items-center justify-center text-white font-bold text-2xl">
                S
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                Sugar
              </span>
            </div>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
