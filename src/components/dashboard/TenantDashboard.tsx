
import { useState, useEffect, useCallback } from "react";
import { User } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import TenantStats from "./TenantStats";
import TenantSearchSection from "./TenantSearchSection";
import TenantPropertyTabs from "./TenantPropertyTabs";

interface TenantDashboardProps {
  user: User;
}

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  is_available: boolean;
  amenities: string[];
  images: string[];
  created_at: string;
  landlord_id: string;
}

interface DashboardState {
  savedProperties: Property[];
  suggestedProperties: Property[];
  unreadMessagesCount: number;
  loading: boolean;
}

const TenantDashboard = ({ user }: TenantDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState<string[]>([]);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    savedProperties: [],
    suggestedProperties: [],
    unreadMessagesCount: 0,
    loading: true,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardState(prev => ({ ...prev, loading: true }));
      
      const [favoritesResult, messagesResult, propertiesResult] = await Promise.all([
        // Fetch saved properties (favorites)
        supabase
          .from('favorites')
          .select(`
            property_id,
            properties (
              id, title, description, property_type, location, price,
              bedrooms, bathrooms, is_furnished, is_pet_friendly, is_available,
              amenities, images, created_at, landlord_id
            )
          `)
          .eq('user_id', user.id),

        // Fetch unread messages count
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false),

        // Fetch suggested properties
        supabase
          .from('properties')
          .select('*')
          .eq('is_available', true)
          .limit(6)
      ]);

      const savedProps = favoritesResult.data?.map(fav => fav.properties).filter(Boolean) as Property[] || [];
      const unreadCount = messagesResult.count || 0;
      
      // Filter out properties that are already saved by the user
      const favoritePropertyIds = favoritesResult.data?.map(fav => fav.property_id) || [];
      const suggested = propertiesResult.data?.filter(prop => 
        !favoritePropertyIds.includes(prop.id)
      ) as Property[] || [];

      setDashboardState({
        savedProperties: savedProps,
        suggestedProperties: suggested,
        unreadMessagesCount: unreadCount,
        loading: false,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardState(prev => ({ ...prev, loading: false }));
    }
  }, [user.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6">
      <TenantStats 
        savedPropertiesCount={dashboardState.savedProperties.length}
        recentSearchesCount={recentSearches.length}
        unreadMessagesCount={dashboardState.unreadMessagesCount}
      />

      <TenantSearchSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentSearches={recentSearches}
      />

      <TenantPropertyTabs 
        savedProperties={dashboardState.savedProperties}
        suggestedProperties={dashboardState.suggestedProperties}
        loading={dashboardState.loading}
      />
    </div>
  );
};

export default TenantDashboard;
