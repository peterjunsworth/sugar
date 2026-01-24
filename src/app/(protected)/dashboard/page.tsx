'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StyledN8nChat from '@/components/chat/StyledN8nChat';

interface GlucoseData {
  value: number;
  unit: string;
  status: string;
  trend: 'up' | 'down' | 'stable';
}

interface MetricData {
  label: string;
  value: string;
  icon: string;
  iconClass: string;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [glucoseData, setGlucoseData] = useState<GlucoseData | null>(null);
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'Last Meal', value: '+45 mg/dL', icon: 'utensils', iconClass: 'food' },
    { label: 'Exercise', value: '-15 mg/dL', icon: 'activity', iconClass: 'exercise' },
    { label: 'Medication', value: 'On time', icon: 'pill', iconClass: 'med' },
  ]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch glucose data
  useEffect(() => {
    const fetchGlucoseData = async () => {
      try {
        const response = await fetch('/api/glucose/latest');
        if (response.ok) {
          const data = await response.json();
          setGlucoseData(data);
        } else {
          // Use default data if API fails
          setGlucoseData({
            value: 123.5,
            unit: 'mg/dL',
            status: "You're in healthy range",
            trend: 'stable'
          });
        }
      } catch (error) {
        console.error('Failed to fetch glucose data:', error);
        setGlucoseData({
          value: 123.5,
          unit: 'mg/dL',
          status: "You're in healthy range",
          trend: 'stable'
        });
      }
    };

    fetchGlucoseData();
    const interval = setInterval(fetchGlucoseData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [mealRes, insulinRes] = await Promise.all([
          fetch('/api/meals/latest'),
          fetch('/api/insulin/latest'),
        ]);

        const mealData = mealRes.ok ? await mealRes.json() : null;
        const insulinData = insulinRes.ok ? await insulinRes.json() : null;

        setMetrics([
          {
            label: 'Last Meal',
            value: mealData ? `+${mealData.impact || 45} mg/dL` : '+45 mg/dL',
            icon: 'utensils',
            iconClass: 'food',
          },
          {
            label: 'Exercise',
            value: '-15 mg/dL',
            icon: 'activity',
            iconClass: 'exercise',
          },
          {
            label: 'Medication',
            value: insulinData ? 'On time' : 'On time',
            icon: 'pill',
            iconClass: 'med',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  // Initialize Lucide icons
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [sidebarActive, glucoseData, metrics]);

  // Theme toggle
  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');

    // Update icons
    const sidebarIcon = document.getElementById('sidebarThemeIcon');
    const headerIcon = document.getElementById('headerThemeIcon');
    const themeText = document.querySelector('.theme-toggle-btn span');

    if (sidebarIcon) sidebarIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    if (headerIcon) headerIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    if (themeText) themeText.textContent = isDark ? 'Dark Mode' : 'Light Mode';

    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  };


  // Handle FAB click
  const handleFabClick = () => {
    alert('Quick actions menu would open here:\n• Log Meal\n• Log Exercise\n• Manual Glucose Entry\n• Ask AI for Advice');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  const displayGlucose = glucoseData || {
    value: 123.5,
    unit: 'mg/dL',
    status: "You're in healthy range",
    trend: 'stable'
  };

  return (
    <div className="app-container">
      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${sidebarActive ? 'active' : ''}`}
        onClick={() => setSidebarActive(false)}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-profile">
            <div className="sidebar-avatar">{user.name?.substring(0, 2).toUpperCase() || 'JD'}</div>
            <div className="sidebar-profile-info">
              <h3>{user.name || 'John Doe'}</h3>
              <p>{user.email || 'john@example.com'}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item active">
            <i data-lucide="home" className="nav-icon"></i>
            <span>Dashboard</span>
          </a>
          <a href="/dashboard/history" className="nav-item">
            <i data-lucide="clock" className="nav-icon"></i>
            <span>History</span>
          </a>
          <a href="/dashboard/profile" className="nav-item">
            <i data-lucide="user" className="nav-icon"></i>
            <span>Profile</span>
          </a>
          <a href="#" className="nav-item">
            <i data-lucide="settings" className="nav-icon"></i>
            <span>Settings</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <span>Dark Mode</span>
            <i data-lucide="moon" className="icon" id="sidebarThemeIcon"></i>
          </button>
        </div>
      </div>

      {/* Header Bar */}
      <div className="header-bar">
        <div className="content-wrapper" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="header-left">
            <button
              className="header-btn"
              aria-label="Menu"
              onClick={() => setSidebarActive(!sidebarActive)}
            >
              <i data-lucide="menu" className="icon"></i>
            </button>
            <h1 className="header-title">Sugar Tracker</h1>
          </div>
          <div className="header-right">
            <button className="header-btn" aria-label="Notifications">
              <i data-lucide="bell" className="icon"></i>
            </button>
            <button
              className="header-btn"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <i data-lucide="moon" className="icon" id="headerThemeIcon"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="content-wrapper" style={{ flex: '0 1 0%', display: 'flex', flexDirection: 'column' }}>
        {/* Glucose Hero Card */}
        <div className="glucose-hero">
          <div className="glucose-value">
            {displayGlucose.value.toFixed(1)} <span className="glucose-unit">{displayGlucose.unit}</span>
          </div>
          <div className="glucose-status">
            <i data-lucide="check-circle" className="icon-lg"></i>
            <span>{displayGlucose.status}</span>
          </div>
          <button className="ai-suggestion-btn">
            <i data-lucide="sparkles" className="icon"></i>
            <span>8 AI Suggestions</span>
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="quick-metrics">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className={`metric-icon ${metric.iconClass}`}>
                <i data-lucide={metric.icon} className="icon"></i>
              </div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
      {/* End Content Wrapper */}

      {/* Chat Container - Full height from here to bottom */}
      <div className="chat-container">
        <StyledN8nChat />
      </div>

      {/* Floating Action Button */}
      <button className="fab" aria-label="Quick actions" onClick={handleFabClick}>
        <i data-lucide="plus" className="icon-xl"></i>
      </button>
    </div>
  );
}
