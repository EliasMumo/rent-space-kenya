
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Search, MessageSquare } from "lucide-react";

interface TenantStatsProps {
  savedPropertiesCount: number;
  recentSearchesCount: number;
  unreadMessagesCount: number;
}

const TenantStats = ({ savedPropertiesCount, recentSearchesCount, unreadMessagesCount }: TenantStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savedPropertiesCount}</div>
          <p className="text-xs text-muted-foreground">Properties you've liked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentSearchesCount}</div>
          <p className="text-xs text-muted-foreground">Search queries this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unreadMessagesCount}</div>
          <p className="text-xs text-muted-foreground">Unread conversations</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantStats;
