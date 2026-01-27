'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, User } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/dashboard');
  };

  const handleReviewProfile = () => {
    router.push('/dashboard/profile');
  };

  return (
    <div className="space-y-4">
      {/* Primary Action */}
      <button
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group"
      >
        <span className="text-lg">Continue to Dashboard</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Secondary Action */}
      <button
        onClick={handleReviewProfile}
        className="w-full bg-card hover:bg-accent text-foreground font-medium py-3 px-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        <User className="w-4 h-4" />
        <span>Review Profile</span>
      </button>
    </div>
  );
}
