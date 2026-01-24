'use client';

import Link from 'next/link';
import { Droplet, ArrowRight, MessageCircle, Activity, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Gradient Background */}
      <div className="gradient-bg">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Droplet className="icon-lg" />
          </div>
          <span className="logo-text">Sugar Tracker</span>
        </div>
        <Link href="/login" className="login-link">
          Log In
        </Link>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Take Control of Your Glucose Levels</h1>
        <p className="hero-subtitle">
          AI-powered tracking, personalized insights, and smart recommendations—all in one simple app.
        </p>
        <div className="cta-buttons">
          <Link href="/signup" className="cta-primary">
            <span>Get Started Free</span>
            <ArrowRight className="icon-lg" />
          </Link>
          <Link href="/login" className="cta-secondary">
            <span>Already have an account?</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Everything You Need</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper ai">
              <MessageCircle className="icon-2xl" style={{ color: 'white' }} />
            </div>
            <div className="feature-content">
              <h3>Chat with AI</h3>
              <p>Log meals with photos or text, ask questions, and get instant personalized advice from your AI health companion.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper track">
              <Activity className="icon-2xl" style={{ color: 'white' }} />
            </div>
            <div className="feature-content">
              <h3>Comprehensive Tracking</h3>
              <p>Monitor glucose levels, food impact, exercise effects, and medication timing all in one beautiful interface.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper insights">
              <Sparkles className="icon-2xl" style={{ color: 'white' }} />
            </div>
            <div className="feature-content">
              <h3>Smart Predictions</h3>
              <p>Get AI-powered glucose predictions and personalized recommendations based on your unique patterns and history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <p className="footer-cta-text">Ready to start your journey?</p>
        <Link href="/signup" className="cta-primary">
          <span>Create Your Account</span>
          <ArrowRight className="icon-lg" />
        </Link>
      </section>
    </div>
  );
}
