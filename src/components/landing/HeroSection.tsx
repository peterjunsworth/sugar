'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative z-10 px-6 py-12 md:py-16 text-center text-white">
      <div className="animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 md:mb-6">
          Take Control of Your Glucose Levels
        </h1>
        <p className="text-lg md:text-xl opacity-95 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
          AI-powered tracking, personalized insights, and smart recommendations—all in one simple app.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:gap-4 animate-fade-in-up max-w-md mx-auto">
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 bg-white text-[var(--p-primary-700)] px-6 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 no-underline"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-6 h-6" />
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-lg border-2 border-white/40 text-white px-6 py-4 rounded-2xl text-base font-semibold hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300 no-underline"
        >
          <span>Already have an account?</span>
        </Link>
      </div>
    </section>
  );
}
