'use client';

import { useEffect, useState } from 'react';

interface MetricData {
  label: string;
  value: string;
  icon: string;
  iconClass: string;
}

export default function QuickMetricsGrid() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [mealRes, insulinRes] = await Promise.all([
          fetch('/api/meals/latest'),
          fetch('/api/insulin/latest'),
        ]);

        const mealData = mealRes.ok ? await mealRes.json() : null;
        const insulinData = insulinRes.ok ? await insulinRes.json() : null;

        const metricsData: MetricData[] = [
          {
            label: 'Last Meal',
            value: mealData ? `+${mealData.impact || 45} mg/dL` : 'No data',
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
            value: insulinData ? 'On time' : 'No data',
            icon: 'pill',
            iconClass: 'med',
          },
        ];

        setMetrics(metricsData);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="quick-metrics">
        {[1, 2, 3].map((i) => (
          <div key={i} className="metric-card">
            <div className="metric-icon food">
              <i data-lucide="loader" className="icon"></i>
            </div>
            <div className="metric-label">Loading...</div>
            <div className="metric-value">--</div>
          </div>
        ))}
      </div>
    );
  }

  return (
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
  );
}
