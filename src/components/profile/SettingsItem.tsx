'use client';

import { ReactNode } from 'react';

interface SettingsItemProps {
  icon: string;
  title: string;
  description?: string;
  value?: string;
  onClick?: () => void;
  isDanger?: boolean;
  toggle?: ReactNode;
}

export function SettingsItem({
  icon,
  title,
  description,
  value,
  onClick,
  isDanger = false,
  toggle,
}: SettingsItemProps) {
  return (
    <div
      className={`settings-item ${isDanger ? 'danger-item' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="settings-icon">
        <i data-lucide={icon} className="icon"></i>
      </div>
      <div className="settings-content">
        <div className="settings-title">{title}</div>
        {description && <div className="settings-description">{description}</div>}
      </div>
      {value && <div className="settings-value">{value}</div>}
      {toggle}
      {!toggle && !value && <i data-lucide="chevron-right" className="icon settings-chevron"></i>}
    </div>
  );
}
