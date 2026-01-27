'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { Droplet, MessageCircle, Activity, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, isLoading, router]);

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="welcome-container">
        <div className="gradient-bg">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="gradient-blob blob-3"></div>
        </div>
        <div className="welcome-content">
          <div className="content-wrapper">
            <div className="text-center text-white">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
              <p className="mt-4">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <div className="welcome-container">
      {/* Animated Background */}
      <div className="gradient-bg">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      {/* Version Badge */}
      <div className="version-badge">v1.0 Beta</div>

      {/* Content */}
      <div className="welcome-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="welcome-header">
            <div className="app-logo">
              <Droplet style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
            </div>
            <h1 className="app-title">Sugar Tracker</h1>
            <p className="app-subtitle">Your intelligent glucose companion</p>
          </div>

          {/* Features */}
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon chat">
                <MessageCircle className="icon-xl" style={{ color: 'white' }} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Chat with AI</h3>
                <p className="feature-description">
                  Ask questions, log meals with photos or text, and get personalized advice instantly.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon track">
                <Activity className="icon-xl" style={{ color: 'white' }} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Track Everything</h3>
                <p className="feature-description">
                  Monitor glucose levels, food impact, exercise effects, and medication timing all in one place.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon insights">
                <Sparkles className="icon-xl" style={{ color: 'white' }} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">Smart Insights</h3>
                <p className="feature-description">
                  Get AI-powered predictions and recommendations based on your unique patterns and history.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="welcome-footer">
            <button className="cta-button" onClick={handleGetStarted}>
              <span>Get Started, {user.name}</span>
              <ArrowRight className="icon-lg" />
            </button>
          </div>
        </div>
        {/* End content-wrapper */}
      </div>
    </div>
  );
}
