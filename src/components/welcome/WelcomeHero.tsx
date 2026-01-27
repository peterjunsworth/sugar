'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface WelcomeHeroProps {
  userName: string;
  isFirstTime?: boolean;
}

export function WelcomeHero({ userName, isFirstTime = false }: WelcomeHeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const greeting = isFirstTime
    ? `Welcome, ${userName}!`
    : `Welcome back, ${userName}!`;

  const subtitle = isFirstTime
    ? "Let's get started on your health journey"
    : "Here's your quick summary";

  return (
    <div
      data-testid="welcome-hero"
      className={`text-center mb-8 transition-all duration-800 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center shadow-lg shadow-primary/40 animate-pulse-slow">
            {isFirstTime ? (
              <Sparkles className="w-10 h-10 text-white" />
            ) : (
              <Heart className="w-10 h-10 text-white" />
            )}
          </div>
          {/* Decorative glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 blur-xl -z-10 animate-pulse-slow"></div>
        </div>
      </div>

      {/* Greeting */}
      <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {greeting}
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
