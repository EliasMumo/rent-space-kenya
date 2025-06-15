
import { memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, Home } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const EmptyState = memo(({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="text-center py-8 text-gray-500">
    <Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
    <p>{title}</p>
    <p className="text-sm">{description}</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

const LoadingState = memo(() => (
  <div className="text-center py-8">
    <p>Loading properties...</p>
  </div>
));

LoadingState.displayName = 'LoadingState';

const PropertyGrid = memo(({ properties, favorites, comparison, onToggleFavorite, onAddToComparison }: { 
  properties: Property[];
  favorites: Set<string>;
  comparison: string[];
  onToggleFavorite: (propertyId: string, isFavorited: boolean) => void;
  onAddToComparison: (propertyId: string) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {properties.map((property) => (
      <PropertyCard 
        key={property.id} 
        property={property}
        onToggleFavorite={onToggleFavorite}
        onAddToComparison={onAddToComparison}
        isFavorited={favorites.has(property.id)}
        isInComparison={comparison.includes(property.id)}
      />
    ))}
  </div>
));

PropertyGrid.displayName = 'PropertyGrid';

const TenantPropertyTabs = memo(({ savedProperties, suggestedProperties, loading }: TenantPropertyTabsProps) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparison, setComparison] = useState<string[]>([]);

  const toggleFavorite = async (propertyId: string, isFavorited: boolean) => {
    if (!user) return;

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      if (!error) {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          property_id: propertyId
        });
      
      if (!error) {
        setFavorites(prev => new Set([...prev, propertyId]));
      }
    }
  };

  const addToComparison = (propertyId: string) => {
    if (comparison.length >= 4) {
      alert('You can compare up to 4 properties at once');
      return;
    }
    
    if (!comparison.includes(propertyId)) {
      setComparison(prev => [...prev, propertyId]);
    }
  };

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
          <LoadingState />
        ) : suggestedProperties.length > 0 ? (
          <PropertyGrid 
            properties={suggestedProperties}
            favorites={favorites}
            comparison={comparison}
            onToggleFavorite={toggleFavorite}
            onAddToComparison={addToComparison}
          />
        ) : (
          <EmptyState 
            icon={Home}
            title="No properties available at the moment"
            description="Check back later for new listings"
          />
        )}
      </TabsContent>

      <TabsContent value="saved" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Saved Properties</h3>
          <Badge variant="secondary">{savedProperties.length} saved</Badge>
        </div>
        {loading ? (
          <LoadingState />
        ) : savedProperties.length > 0 ? (
          <PropertyGrid 
            properties={savedProperties}
            favorites={favorites}
            comparison={comparison}
            onToggleFavorite={toggleFavorite}
            onAddToComparison={addToComparison}
          />
        ) : (
          <EmptyState 
            icon={Heart}
            title="No saved properties yet"
            description="Start browsing and save properties you like"
          />
        )}
      </TabsContent>

      <TabsContent value="recent" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recently Viewed</h3>
          <Button variant="outline" size="sm">Clear History</Button>
        </div>
        <EmptyState 
          icon={Calendar}
          title="No recently viewed properties"
          description="Properties you view will appear here"
        />
      </TabsContent>
    </Tabs>
  );
});

TenantPropertyTabs.displayName = 'TenantPropertyTabs';

export default TenantPropertyTabs;
