
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, Home } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";

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

interface TenantPropertyTabsProps {
  savedProperties: Property[];
  suggestedProperties: Property[];
  loading: boolean;
}

const TenantPropertyTabs = ({ savedProperties, suggestedProperties, loading }: TenantPropertyTabsProps) => {
  return (
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
  );
};

export default TenantPropertyTabs;
