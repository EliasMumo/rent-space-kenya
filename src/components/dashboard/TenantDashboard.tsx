
import { useState, useEffect } from "react";
import { User } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import TenantStats from "./TenantStats";
import TenantSearchSection from "./TenantSearchSection";
import TenantPropertyTabs from "./TenantPropertyTabs";

interface TenantDashboardProps {
  user: User;
}

// Define a proper interface for the Property type used in this component
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

const TenantDashboard = ({ user }: TenantDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [suggestedProperties, setSuggestedProperties] = useState<Property[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch saved properties (favorites)
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          property_id,
          properties (
            id,
            title,
            description,
            property_type,
            location,
            price,
            bedrooms,
            bathrooms,
            is_furnished,
            is_pet_friendly,
            is_available,
            amenities,
            images,
            created_at,
            landlord_id
          )
        `)
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
      } else {
        const savedProps = favorites?.map(fav => fav.properties).filter(Boolean) || [];
        setSavedProperties(savedProps as Property[]);
      }

      // Fetch unread messages count
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', user.id)
        .eq('is_read', false);

      if (messagesError) {
        console.error('Error fetching unread messages:', messagesError);
      } else {
        setUnreadMessagesCount(messages?.length || 0);
      }

      // Fetch suggested properties (available properties that are not favorited by user)
      const { data: allProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .limit(6);

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
      } else {
        // Filter out properties that are already saved by the user
        const favoritePropertyIds = favorites?.map(fav => fav.property_id) || [];
        const suggested = allProperties?.filter(prop => 
          !favoritePropertyIds.includes(prop.id)
        ) || [];
        setSuggestedProperties(suggested as Property[]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <TenantStats 
        savedPropertiesCount={savedProperties.length}
        recentSearchesCount={recentSearches.length}
        unreadMessagesCount={unreadMessagesCount}
      />

      <TenantSearchSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentSearches={recentSearches}
      />

      <TenantPropertyTabs 
        savedProperties={savedProperties}
        suggestedProperties={suggestedProperties}
        loading={loading}
      />
    </div>
  );
};

export default TenantDashboard;
