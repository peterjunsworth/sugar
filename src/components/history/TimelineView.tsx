import { TimelineEntry } from './TimelineEntry';

interface Entry {
  id: string;
  type: 'meal' | 'glucose' | 'insulin' | 'exercise';
  timestamp: string;
  data: any;
}

interface TimelineViewProps {
  entries: Entry[];
}

export function TimelineView({ entries }: TimelineViewProps) {
  // Format entry data for display
  const formatEntry = (entry: Entry) => {
    const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    switch (entry.type) {
      case 'meal':
        return {
          type: 'meal' as const,
          time,
          title: `${entry.data.emoji || '🍽️'} ${entry.data.name}`,
          details: entry.data.description || entry.data.details,
          badge: entry.data.impact ? {
            text: `+${entry.data.impact} mg/dL`,
            variant: entry.data.impact > 45 ? 'high' : 'default' as 'high' | 'default',
            icon: 'trending-up'
          } : undefined
        };

      case 'glucose':
        return {
          type: 'glucose' as const,
          time,
          title: `${entry.data.value} mg/dL`,
          details: entry.data.note || entry.data.context,
          badge: {
            text: entry.data.status || 'Healthy',
            variant: 'default' as const,
            icon: 'check-circle'
          }
        };

      case 'insulin':
        return {
          type: 'insulin' as const,
          time,
          title: `${entry.data.amount} units ${entry.data.insulinType}`,
          details: entry.data.note || `${entry.data.delivery || 'Bolus'} delivery`,
          badge: entry.data.badge ? {
            text: entry.data.badge.text,
            variant: entry.data.badge.variant || 'default' as const,
            icon: entry.data.badge.icon
          } : undefined
        };

      case 'exercise':
        return {
          type: 'exercise' as const,
          time,
          title: `${entry.data.emoji || '🏃'} ${entry.data.activity}`,
          details: `${entry.data.duration} minutes${entry.data.intensity ? ', ' + entry.data.intensity + ' intensity' : ''}`,
          badge: entry.data.impact ? {
            text: `${entry.data.impact} mg/dL`,
            variant: 'low' as const,
            icon: 'trending-down'
          } : undefined
        };

      default:
        return {
          type: 'meal' as const,
          time,
          title: 'Unknown Entry',
          details: '',
        };
    }
  };

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i data-lucide="clock" className="icon"></i>
        </div>
        <div className="empty-title">No entries yet</div>
        <div className="empty-description">
          Start by chatting with your assistant to log your meals, glucose readings, and activities!
        </div>
      </div>
    );
  }

  return (
    <div className="timeline">
      {entries.map((entry) => {
        const formattedEntry = formatEntry(entry);
        return (
          <TimelineEntry
            key={entry.id}
            {...formattedEntry}
          />
        );
      })}
    </div>
  );
}
