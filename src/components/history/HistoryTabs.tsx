'use client';

interface HistoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function HistoryTabs({ activeTab, onTabChange }: HistoryTabsProps) {
  const tabs = [
    { id: 'meals', label: 'Meals' },
    { id: 'glucose', label: 'Glucose' },
    { id: 'exercise', label: 'Exercise' },
  ];

  return (
    <div className="tabs-container">
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            data-tab={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
