'use client';

import { useEffect, useState } from 'react';

interface GlucoseData {
  value: number;
  unit: string;
  status: string;
  trend: 'up' | 'down' | 'stable';
  timestamp: Date;
}

export default function GlucoseHeroCard() {
  const [glucoseData, setGlucoseData] = useState<GlucoseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlucoseData = async () => {
      try {
        const response = await fetch('/api/glucose/latest');
        if (response.ok) {
          const data = await response.json();
          setGlucoseData(data);
        }
      } catch (error) {
        console.error('Failed to fetch glucose data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlucoseData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchGlucoseData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="glucose-hero">
        <div className="glucose-value">-- <span className="glucose-unit">mg/dL</span></div>
        <div className="glucose-status">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!glucoseData) {
    return (
      <div className="glucose-hero">
        <div className="glucose-value">-- <span className="glucose-unit">mg/dL</span></div>
        <div className="glucose-status">
          <span>No recent data</span>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'stable':
        return '→';
      default:
        return '→';
    }
  };

  return (
    <div className="glucose-hero">
      <div className="glucose-value">
        {glucoseData.value.toFixed(1)} <span className="glucose-unit">{glucoseData.unit}</span>
      </div>
      <div className="glucose-status">
        <i data-lucide="check-circle" className="icon-lg"></i>
        <span>{glucoseData.status}</span>
        <span style={{ fontSize: '1.5rem', marginLeft: '0.5rem' }}>
          {getTrendIcon(glucoseData.trend)}
        </span>
      </div>
      <button className="ai-suggestion-btn">
        <i data-lucide="sparkles" className="icon"></i>
        <span>8 AI Suggestions</span>
      </button>
    </div>
  );
}
