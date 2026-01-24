'use client';

import { Calendar, Activity, TrendingUp, Flame } from 'lucide-react';

interface StatsData {
  daysActive: number;
  entriesLogged: number;
  averageGlucose: number;
  currentStreak?: number;
}

interface QuickStatsCardProps {
  stats: StatsData;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBgClass: string;
}

function StatItem({ icon, label, value, iconBgClass }: StatItemProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {value}
          </p>
          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  const { daysActive, entriesLogged, averageGlucose, currentStreak } = stats;

  const statItems = [
    {
      icon: <Calendar className="w-6 h-6 text-white" />,
      label: daysActive === 1 ? 'Day Active' : 'Days Active',
      value: daysActive.toString(),
      iconBgClass: 'bg-gradient-to-br from-primary to-primary/80',
      testId: 'days-active',
    },
    {
      icon: <Activity className="w-6 h-6 text-white" />,
      label: entriesLogged === 1 ? 'Entry Logged' : 'Entries Logged',
      value: entriesLogged.toString(),
      iconBgClass: 'bg-gradient-to-br from-purple-500 to-purple-600',
      testId: 'entries-logged',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      label: 'Average Glucose',
      value: `${averageGlucose} mg/dL`,
      iconBgClass: 'bg-gradient-to-br from-coral-500 to-coral-600',
      testId: 'avg-glucose',
    },
  ];

  // Add streak if provided
  if (currentStreak !== undefined && currentStreak > 0) {
    statItems.push({
      icon: <Flame className="w-6 h-6 text-white" />,
      label: currentStreak === 1 ? 'Day Streak' : 'Day Streak',
      value: currentStreak.toString(),
      iconBgClass: 'bg-gradient-to-br from-orange-500 to-orange-600',
      testId: 'current-streak',
    });
  }

  return (
    <div
      data-testid="quick-stats"
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-foreground">Your Progress</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <div key={index} data-testid={item.testId}>
            <StatItem
              icon={item.icon}
              label={item.label}
              value={item.value}
              iconBgClass={item.iconBgClass}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
