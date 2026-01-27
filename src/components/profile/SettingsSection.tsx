'use client';

import { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="section">
      <div className="section-title">{title}</div>
      <div className="settings-list">
        {children}
      </div>
    </div>
  );
}
