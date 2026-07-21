import React from 'react';

interface StatusBadgeProps {
  label: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ label, status }) => {
  const getColors = () => {
    switch (status) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'error':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'info':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors()} backdrop-blur-sm transition-all duration-300`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current animate-pulse" />
      {label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
export default StatusBadge;
