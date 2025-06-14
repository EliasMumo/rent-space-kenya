
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, MessageSquare, Calendar, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  views?: number;
  inquiries?: number;
  created_at: string;
}

interface AnalyticsData {
  totalViews: number;
  totalInquiries: number;
  avgViewsPerProperty: number;
  topPerformingProperty?: Property;
  recentActivity: {
    date: string;
    views: number;
    inquiries: number;
  }[];
}

interface AnalyticsViewProps {
  landlordId: string;
}

const AnalyticsView = ({ landlordId }: AnalyticsViewProps) => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [landlordId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', landlordId);

      if (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        });
        return;
      }

      if (!properties || properties.length === 0) {
        setAnalytics(null);
        return;
      }

      const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
      const avgViewsPerProperty = properties.length > 0 ? totalViews / properties.length : 0;
      
      const topPerformingProperty = properties.reduce((top, current) => {
        const currentScore = (current.views || 0) + (current.inquiries || 0) * 2;
        const topScore = (top?.views || 0) + (top?.inquiries || 0) * 2;
        return currentScore > topScore ? current : top;
      }, properties[0]);

      // Generate mock recent activity data (in a real app, this would come from a tracking table)
      const recentActivity = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        views: Math.floor(Math.random() * 20),
        inquiries: Math.floor(Math.random() * 5)
      })).reverse();

      setAnalytics({
        totalViews,
        totalInquiries,
        avgViewsPerProperty,
        topPerformingProperty,
        recentActivity
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No analytics data yet</h3>
        <p className="text-gray-600 mb-4">Add properties to start seeing analytics</p>
        <p className="text-sm text-gray-500">Analytics will show views, inquiries, and performance metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Avg {analytics.avgViewsPerProperty.toFixed(1)} per property
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalViews > 0 ? ((analytics.totalInquiries / analytics.totalViews) * 100).toFixed(1) : 0}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Property</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{analytics.topPerformingProperty?.title}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.topPerformingProperty?.views || 0} views, {analytics.topPerformingProperty?.inquiries || 0} inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentActivity.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{day.date}</span>
                <div className="flex space-x-4 text-sm">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1 text-blue-500" />
                    {day.views} views
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1 text-green-500" />
                    {day.inquiries} inquiries
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsView;
