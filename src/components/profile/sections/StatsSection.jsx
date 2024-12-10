import React from 'react';

const StatsSection = ({ userStats }) => {
  const stats = [
    { label: 'Followers', value: userStats?.followers || 0 },
    { label: 'Following', value: userStats?.following || 0 },
    { label: 'Likes', value: userStats?.likes || 0 },
  ];

  return (
    <div className="flex gap-8 text-sm">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-medium">{value}</span>
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;