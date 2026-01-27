'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GlucoseHeroCard from '@/components/dashboard/GlucoseHeroCard';
import QuickMetricsGrid from '@/components/dashboard/QuickMetricsGrid';
import N8nChatInterface from '@/components/chat/N8nChatInterface';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Initialize Lucide icons for the dashboard components
    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header Bar */}
      <div className="header-bar">
        <div className="content-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          <div className="header-left">
            <button className="header-btn" aria-label="Menu" id="menuBtn">
              <i data-lucide="menu" className="icon"></i>
            </button>
            <h1 className="header-title">Sugar Tracker</h1>
          </div>
          <div className="header-right">
            <button className="header-btn" aria-label="Notifications">
              <i data-lucide="bell" className="icon"></i>
            </button>
            <button className="header-btn" aria-label="Toggle theme" id="headerThemeToggle">
              <i data-lucide="moon" className="icon" id="headerThemeIcon"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {/* Glucose Hero Card */}
        <GlucoseHeroCard />

        {/* Quick Metrics */}
        <QuickMetricsGrid />

        {/* Chat Container */}
        <div className="chat-container">
          <N8nChatInterface />
        </div>
      </div>
    </div>
  );
}
