'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HistoryTabs } from '@/components/history/HistoryTabs';
import { TimelineView } from '@/components/history/TimelineView';
import { DateSeparator } from '@/components/history/DateSeparator';

interface HistoryEntry {
  id: string;
  type: 'meal' | 'glucose' | 'insulin' | 'exercise';
  timestamp: string;
  data: any;
}

export default function HistoryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState('meals');
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch history data
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingData(true);
      try {
        const response = await fetch(`/api/history?type=${activeTab}`);
        if (response.ok) {
          const data = await response.json();
          setEntries(data.entries || []);
        } else {
          console.error('Failed to fetch history');
          setEntries([]);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setEntries([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user, activeTab]);

  // Initialize Lucide icons
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [sidebarActive, entries, activeTab]);

  // Theme toggle
  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');

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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading history...</div>
      </div>
    );
  }

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
          <a href="/dashboard" className="nav-item">
            <i data-lucide="home" className="nav-icon"></i>
            <span>Dashboard</span>
          </a>
          <a href="/dashboard/history" className="nav-item active">
            <i data-lucide="clock" className="nav-icon"></i>
            <span>History</span>
          </a>
          <a href="#" className="nav-item">
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
              className="header-btn header-menu-btn"
              aria-label="Menu"
              onClick={() => setSidebarActive(!sidebarActive)}
            >
              <i data-lucide="menu" className="icon"></i>
            </button>
            <button
              className="header-btn"
              aria-label="Back to dashboard"
              onClick={() => router.push('/dashboard')}
            >
              <i data-lucide="arrow-left" className="icon"></i>
            </button>
            <h1 className="header-title">History</h1>
          </div>
          <div className="header-right">
            <button
              className="header-btn"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <i data-lucide="moon" className="icon" id="headerThemeIcon"></i>
            </button>
            <button className="header-btn" aria-label="Filter">
              <i data-lucide="filter" className="icon"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <HistoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="content-container">
        <div className="content-wrapper">
          {/* Date Header */}
          <DateSeparator date={currentDate} />

          {/* Timeline */}
          {isLoadingData ? (
            <div className="empty-state">
              <div className="empty-title">Loading entries...</div>
            </div>
          ) : (
            <TimelineView entries={entries} />
          )}
        </div>
      </div>
    </div>
  );
}
