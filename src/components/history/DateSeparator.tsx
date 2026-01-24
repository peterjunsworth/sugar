interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="date-header">
      <div className="date-text">{date}</div>
      <div className="date-nav">
        <button className="date-nav-btn" aria-label="Previous day">
          <i data-lucide="chevron-left" className="icon-sm"></i>
        </button>
        <button className="date-nav-btn" aria-label="Next day">
          <i data-lucide="chevron-right" className="icon-sm"></i>
        </button>
      </div>
    </div>
  );
}
