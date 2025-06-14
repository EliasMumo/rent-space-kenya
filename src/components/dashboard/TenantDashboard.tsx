
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Heart, 
  MessageSquare, 
  MapPin, 
  Filter,
  Star,
  Bed,
  Bath,
  Calendar
} from "lucide-react";
import { User } from "@/hooks/useAuth";
import PropertyCard from "@/components/properties/PropertyCard";
import { supabase } from "@/integrations/supabase/client";

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
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedProperties.length}</div>
            <p className="text-xs text-muted-foreground">Properties you've liked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSearches.length}</div>
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

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Home</CardTitle>
          <CardDescription>Search for rental properties across Kenya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter location (e.g., Kilimani, Karen, Westlands)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Recent Searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="suggested" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggested">Suggested Properties</TabsTrigger>
          <TabsTrigger value="saved">Saved Properties</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Properties You Might Like</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading properties...</p>
            </div>
          ) : suggestedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No properties available at the moment</p>
              <p className="text-sm">Check back later for new listings</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Saved Properties</h3>
            <Badge variant="secondary">{savedProperties.length} saved</Badge>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading saved properties...</p>
            </div>
          ) : savedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No saved properties yet</p>
              <p className="text-sm">Start browsing and save properties you like</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recently Viewed</h3>
            <Button variant="outline" size="sm">Clear History</Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recently viewed properties</p>
            <p className="text-sm">Properties you view will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard;
