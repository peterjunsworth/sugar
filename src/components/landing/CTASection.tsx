'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="px-6 py-12 md:py-16 text-center">
      <div
        className="max-w-2xl mx-auto p-8 md:p-12 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, var(--p-primary-600), var(--p-primary-400))',
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Start Your Journey to Better Health
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Join thousands of people taking control of their glucose levels with AI-powered insights
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 no-underline"
          style={{ color: 'var(--p-primary-700)' }}
        >
          <span>Create Your Account</span>
          <ArrowRight className="w-6 h-6" />
        </Link>

        <p className="text-sm text-white/80 mt-4">
          No credit card required • Free forever plan available
        </p>
      </div>
    </section>
  );
}
