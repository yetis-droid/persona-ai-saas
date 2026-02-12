// 公式バッジコンポーネント
import React from 'react';

interface OfficialBadgeProps {
  badgeType?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const OfficialBadge: React.FC<OfficialBadgeProps> = ({ 
  badgeType, 
  size = 'md',
  showLabel = true 
}) => {
  if (!badgeType) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const badges = {
    creator: {
      icon: '✨',
      label: '公式クリエイター',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-300'
    },
    partner: {
      icon: '🤝',
      label: '公式パートナー',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300'
    },
    verified: {
      icon: '✓',
      label: '認証済み',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300'
    }
  };

  const badge = badges[badgeType as keyof typeof badges];
  
  if (!badge) return null;

  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full border
        ${badge.bgColor} ${badge.textColor} ${badge.borderColor}
        ${sizeClasses[size]}
        font-medium
      `}
      title={badge.label}
    >
      <span>{badge.icon}</span>
      {showLabel && <span>{badge.label}</span>}
    </span>
  );
};

export default OfficialBadge;
