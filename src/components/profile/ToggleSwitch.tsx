'use client';

interface ToggleSwitchProps {
  active: boolean;
  onClick?: () => void;
}

export function ToggleSwitch({ active, onClick }: ToggleSwitchProps) {
  return (
    <div
      className={`toggle-switch ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="toggle-knob"></div>
    </div>
  );
}
