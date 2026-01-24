'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Perfect for getting started',
    features: [
      'Manual glucose logging',
      'Basic meal tracking',
      'Exercise logging',
      'Simple charts & trends',
      'Email support',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/mo',
    description: 'Everything you need to thrive',
    features: [
      'Everything in Free',
      'AI chat assistant',
      'CGM integration (Dexcom, Libre)',
      'Predictive insights',
      'Advanced analytics',
      'Photo meal logging',
      'Priority support',
      'Export your data',
    ],
    featured: true,
  },
];

export function PricingSection() {
  return (
    <section className="px-6 py-8 md:py-12">
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-3"
        style={{ color: 'var(--foreground)' }}
      >
        Choose Your Plan
      </h2>
      <p
        className="text-center mb-8 md:mb-12"
        style={{ color: 'var(--muted-foreground)' }}
      >
        Start free, upgrade anytime
      </p>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            data-testid="pricing-card"
            className={`relative p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              plan.featured ? 'md:scale-105' : ''
            }`}
            style={{
              background: 'var(--surface-card)',
              borderColor: plan.featured ? 'var(--p-primary-500)' : 'var(--surface-border)',
              borderWidth: plan.featured ? '2px' : '1px',
            }}
          >
            {plan.featured && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                style={{ background: 'var(--p-primary-500)' }}
              >
                Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center mb-2">
                <span
                  className="text-4xl font-extrabold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-lg ml-1"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className="text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {plan.description}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--p-primary-500)' }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md no-underline ${
                plan.featured
                  ? 'text-white'
                  : 'border'
              }`}
              style={
                plan.featured
                  ? { background: 'var(--p-primary-500)' }
                  : {
                      background: 'transparent',
                      borderColor: 'var(--surface-border)',
                      color: 'var(--foreground)',
                    }
              }
            >
              Choose {plan.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
