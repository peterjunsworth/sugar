'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsGrid } from '@/components/profile/StatsGrid';
import { SettingsSection } from '@/components/profile/SettingsSection';
import { SettingsItem } from '@/components/profile/SettingsItem';
import { ToggleSwitch } from '@/components/profile/ToggleSwitch';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  weight: number;
  weightUnit: 'lbs' | 'kg';
  diabetesType: string;
  glucoseTargets: {
    low: number;
    high: number;
    unit: string;
  };
  device: string;
}

interface UserStats {
  daysActive: number;
  inRange: number;
}

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          // Use default data
          setProfile({
            name: user?.name || 'John Doe',
            email: user?.email || 'john@example.com',
            age: 35,
            weight: 75,
            weightUnit: 'kg',
            diabetesType: 'Type 2',
            glucoseTargets: {
              low: 70,
              high: 180,
              unit: 'mg/dL',
            },
            device: 'Dexcom G6',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfile({
          name: user?.name || 'John Doe',
          email: user?.email || 'john@example.com',
          age: 35,
          weight: 75,
          weightUnit: 'kg',
          diabetesType: 'Type 2',
          glucoseTargets: {
            low: 70,
            high: 180,
            unit: 'mg/dL',
          },
          device: 'Dexcom G6',
        });
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // Use default data
          setStats({
            daysActive: 28,
            inRange: 92,
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({
          daysActive: 28,
          inRange: 92,
        });
      }
    };

    fetchStats();
  }, []);

  // Initialize Lucide icons
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, [sidebarActive, profile, stats, notificationsEnabled, isDarkMode]);

  // Check initial theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      setIsDarkMode(html.classList.contains('dark'));
    }
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    setIsDarkMode(isDark);

    // Update sidebar icon
    const sidebarIcon = document.getElementById('sidebarThemeIcon');
    if (sidebarIcon) sidebarIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');

    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading || !user || !profile || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    );
  }

  const statsData = [
    { value: `${stats.daysActive}`, label: 'Days Active' },
    { value: `${stats.inRange}%`, label: 'In Range' },
  ];

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
          <a href="/dashboard/history" className="nav-item">
            <i data-lucide="clock" className="nav-icon"></i>
            <span>History</span>
          </a>
          <a href="/dashboard/profile" className="nav-item active">
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
              aria-label="Back to Dashboard"
              onClick={() => router.push('/dashboard')}
            >
              <i data-lucide="arrow-left" className="icon"></i>
            </button>
            <h1 className="header-title">Profile</h1>
          </div>
          <div className="header-right">
            <button className="header-btn" aria-label="Toggle theme" onClick={toggleTheme}>
              <i data-lucide={isDarkMode ? 'moon' : 'sun'} className="icon"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <ProfileHeader name={profile.name} email={profile.email} />

      {/* Content */}
      <div className="content-container">
        <div className="content-wrapper">
          {/* Stats */}
          <StatsGrid stats={statsData} />

          {/* Personal Info Section */}
          <SettingsSection title="Personal Information">
            <SettingsItem
              icon="user"
              title="Full Name"
              description={profile.name}
              onClick={() => {}}
            />
            <SettingsItem
              icon="calendar"
              title="Age & Weight"
              description={`${profile.age} years, ${profile.weight} ${profile.weightUnit}`}
              onClick={() => {}}
            />
            <SettingsItem
              icon="heart-pulse"
              title="Diabetes Type"
              description={profile.diabetesType}
              onClick={() => {}}
            />
          </SettingsSection>

          {/* Health Settings Section */}
          <SettingsSection title="Health Settings">
            <SettingsItem
              icon="target"
              title="Glucose Targets"
              description={`${profile.glucoseTargets.low} - ${profile.glucoseTargets.high} ${profile.glucoseTargets.unit}`}
              onClick={() => {}}
            />
            <SettingsItem
              icon="watch"
              title="Connected Devices"
              description={profile.device}
              onClick={() => {}}
            />
            <SettingsItem
              icon="bell"
              title="Notifications"
              description="Alerts for high/low levels"
              toggle={
                <ToggleSwitch
                  active={notificationsEnabled}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                />
              }
            />
          </SettingsSection>

          {/* App Settings Section */}
          <SettingsSection title="App Settings">
            <SettingsItem
              icon="moon"
              title="Dark Mode"
              description="Use dark theme"
              toggle={<ToggleSwitch active={isDarkMode} onClick={toggleTheme} />}
            />
            <SettingsItem
              icon="shield"
              title="Privacy & Security"
              description="Data permissions"
              onClick={() => {}}
            />
            <SettingsItem
              icon="life-buoy"
              title="Help & Support"
              description="FAQs and contact"
              onClick={() => {}}
            />
          </SettingsSection>

          {/* Account Section */}
          <SettingsSection title="Account">
            <SettingsItem icon="log-out" title="Log Out" isDanger onClick={handleLogout} />
            <SettingsItem icon="trash-2" title="Delete Account" isDanger onClick={() => {}} />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
