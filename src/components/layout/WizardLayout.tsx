'use client';

import { ReactNode } from 'react';

interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  showSkip?: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export function WizardLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  showBack = true,
  showNext = true,
  showSkip = false,
  nextLabel = 'Next',
  nextDisabled = false,
}: WizardLayoutProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header with Progress Bar */}
      <div
        className="border-b"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--surface-border)',
        }}
      >
        {/* Logo */}
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--p-primary-500)] flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              Sugar
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--surface-hover)' }}
              >
                <div
                  className="h-full transition-all duration-300 ease-out rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: 'var(--p-primary-500)',
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {currentStep} / {totalSteps}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Step Content */}
          <div className="mb-8">{children}</div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div>
              {showBack && currentStep > 1 && (
                <button
                  onClick={onBack}
                  className="btn btn-outline"
                  type="button"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {showSkip && (
                <button
                  onClick={onSkip}
                  className="btn btn-ghost"
                  type="button"
                >
                  Skip
                </button>
              )}
              {showNext && (
                <button
                  onClick={onNext}
                  className="btn btn-primary"
                  disabled={nextDisabled}
                  type="button"
                >
                  {nextLabel}
                  {currentStep < totalSteps && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
