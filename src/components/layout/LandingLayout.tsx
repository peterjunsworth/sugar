'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Background */}
      <div
        className="fixed top-0 left-0 right-0 h-[60vh] -z-10"
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
            top: '-200px',
            right: '-150px',
            animation: 'blobFloat 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full blur-[80px] opacity-40"
          style={{
            width: '300px',
            height: '300px',
            background: 'var(--accent-coral-500)',
            top: '100px',
            left: '-100px',
            animation: 'blobFloat 12s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[480px] mx-auto relative z-10">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
