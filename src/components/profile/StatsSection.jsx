import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center p-4 text-center">
    <div className="mb-2">
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
    <span className="text-2xl font-bold">{value}</span>
    <span className="text-sm text-muted-foreground">{label}</span>
  </div>
);

const StatsSection = ({ followers, following, likes }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x">
          <StatCard
            icon={Users}
            value={followers || 0}
            label="Followers"
          />
          <StatCard
            icon={Users}
            value={following || 0}
            label="Following"
          />
          <StatCard
            icon={Heart}
            value={likes || 0}
            label="Likes"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSection;