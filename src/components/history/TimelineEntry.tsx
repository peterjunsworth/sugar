interface TimelineEntryProps {
  type: 'meal' | 'glucose' | 'insulin' | 'exercise';
  time: string;
  title: string;
  details: string;
  badge?: {
    text: string;
    variant: 'default' | 'high' | 'low';
    icon?: string;
  };
}

export function TimelineEntry({ type, time, title, details, badge }: TimelineEntryProps) {
  // Map type to dot color class
  const dotColorClass = {
    meal: 'meal',
    glucose: 'glucose',
    insulin: 'insulin',
    exercise: 'exercise',
  }[type];

  // Map badge variant to class
  const badgeClass = badge?.variant === 'high'
    ? 'timeline-badge high'
    : badge?.variant === 'low'
    ? 'timeline-badge low'
    : 'timeline-badge';

  return (
    <div className="timeline-item">
      <div className={`timeline-dot ${dotColorClass}`}></div>
      <div className="timeline-card">
        <div className="timeline-header">
          <div className="timeline-time">{time}</div>
        </div>
        <div className="timeline-title">{title}</div>
        <div className="timeline-details">{details}</div>
        {badge && (
          <div className={badgeClass}>
            {badge.icon && <i data-lucide={badge.icon} className="icon" style={{ width: '0.75rem', height: '0.75rem' }}></i>}
            {badge.text}
          </div>
        )}
      </div>
    </div>
  );
}
