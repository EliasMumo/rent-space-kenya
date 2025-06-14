
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Search, MessageSquare } from "lucide-react";

interface TenantStatsProps {
  savedPropertiesCount: number;
  recentSearchesCount: number;
  unreadMessagesCount: number;
}

const StatCard = memo(({ title, count, description, icon: Icon }: {
  title: string;
  count: number;
  description: string;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{count}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

const TenantStats = memo(({ savedPropertiesCount, recentSearchesCount, unreadMessagesCount }: TenantStatsProps) => {
  const stats = [
    {
      title: "Saved Properties",
      count: savedPropertiesCount,
      description: "Properties you've liked",
      icon: Heart
    },
    {
      title: "Recent Searches",
      count: recentSearchesCount,
      description: "Search queries this week",
      icon: Search
    },
    {
      title: "Messages",
      count: unreadMessagesCount,
      description: "Unread conversations",
      icon: MessageSquare
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
});

TenantStats.displayName = 'TenantStats';

export default TenantStats;
