'use client';

import { Link2, MessageCircle, TrendingUp, Heart } from 'lucide-react';

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: <Link2 className="w-6 h-6" />,
    title: 'Connect Your CGM',
    description: 'Link your continuous glucose monitor (Dexcom, Libre, or Eversense) to automatically sync your data.',
  },
  {
    number: 2,
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Chat with AI',
    description: 'Log meals, ask questions, and get instant answers from your personal AI health assistant.',
  },
  {
    number: 3,
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Get Insights',
    description: 'Discover patterns in your glucose levels and understand how food, exercise, and lifestyle affect you.',
  },
  {
    number: 4,
    icon: <Heart className="w-6 h-6" />,
    title: 'Optimize Health',
    description: 'Receive personalized recommendations to maintain stable glucose levels and improve your wellbeing.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="px-6 py-8 md:py-12">
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12"
        style={{ color: 'var(--foreground)' }}
      >
        How It Works
      </h2>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              data-testid="step-item"
              className="flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              style={{
                background: 'var(--surface-card)',
                borderColor: 'var(--surface-border)',
              }}
            >
              {/* Step Number & Icon */}
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background: 'var(--p-primary-500)',
                    color: 'white',
                  }}
                >
                  {step.icon}
                </div>
                <div
                  className="text-center text-sm font-bold"
                  style={{ color: 'var(--p-primary-500)' }}
                >
                  Step {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
