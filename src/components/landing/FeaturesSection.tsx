'use client';

import { MessageCircle, Activity, Sparkles } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientClass: string;
}

const features: Feature[] = [
  {
    icon: <MessageCircle className="w-8 h-8 text-white" />,
    title: 'Chat with AI',
    description:
      'Log meals with photos or text, ask questions, and get instant personalized advice from your AI health companion.',
    gradientClass: 'bg-gradient-to-br from-[var(--accent-purple-400)] to-[var(--accent-purple-500)]',
  },
  {
    icon: <Activity className="w-8 h-8 text-white" />,
    title: 'Comprehensive Tracking',
    description:
      'Monitor glucose levels, food impact, exercise effects, and medication timing all in one beautiful interface.',
    gradientClass: 'bg-gradient-to-br from-[var(--p-primary-400)] to-[var(--p-primary-500)]',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-white" />,
    title: 'Smart Predictions',
    description:
      'Get AI-powered glucose predictions and personalized recommendations based on your unique patterns and history.',
    gradientClass: 'bg-gradient-to-br from-[var(--accent-coral-400)] to-[var(--accent-coral-500)]',
  },
];

export function FeaturesSection() {
  return (
    <section
      className="relative z-10 rounded-t-[2rem] -mt-8 px-6 py-8 md:py-12 animate-fade-in-up"
      style={{
        background: 'var(--background)',
        animationDelay: '0.4s',
        animationFillMode: 'backwards',
      }}
    >
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8"
        style={{ color: 'var(--foreground)' }}
      >
        Everything You Need
      </h2>

      <div className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            data-testid="feature-card"
            className="flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: 'var(--surface-card)',
              borderColor: 'var(--surface-border)',
            }}
          >
            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${feature.gradientClass}`}>
              {feature.icon}
            </div>

            <div className="flex-1">
              <h3
                className="text-lg md:text-xl font-semibold mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
