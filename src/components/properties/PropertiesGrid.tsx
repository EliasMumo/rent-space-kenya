
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import PropertyMap from "./PropertyMap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Grid, Map } from "lucide-react";
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
  profiles?: {
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string;
    caretaker_phone: string;
    display_phone_preference: string;
  };
}

const PropertiesGrid = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparison, setComparison] = useState<string[]>([]);

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select(`
          *,
          profiles:landlord_id (
            first_name,
            last_name,
            phone,
            avatar_url,
            caretaker_phone,
            display_phone_preference
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive"
        });
        return;
      }

      setProperties(data || []);
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

  const fetchFavorites = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', user.id);
    
    if (data) {
      setFavorites(new Set(data.map(f => f.property_id)));
    }
  };

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
      toast({
        title: "Comparison Limit",
        description: "You can compare up to 4 properties at once",
        variant: "destructive"
      });
      return;
    }
    
    if (!comparison.includes(propertyId)) {
      setComparison(prev => [...prev, propertyId]);
      toast({
        title: "Added to Comparison",
        description: "Property added to comparison list"
      });
    }
  };

  const handleSearch = () => {
    // This function can be enhanced to trigger specific search queries
    console.log('Search triggered with current filters');
  };

  const handlePropertySelect = (property: Property) => {
    // Scroll to property in grid view or show details
    console.log('Selected property:', property);
    toast({
      title: "Property Selected",
      description: `Selected ${property.title}`
    });
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchQuery === "" || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "" || 
      property.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = typeFilter === "" || property.property_type === typeFilter;
    
    const matchesBedrooms = bedroomFilter === "" || 
      property.bedrooms.toString() === bedroomFilter;
    
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];

    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => property.amenities?.includes(amenity));

    // Move-in date filtering can be enhanced with actual availability data
    const matchesMoveInDate = moveInDate === "" || true; // Placeholder for now

    return matchesSearch && matchesLocation && matchesType && 
           matchesBedrooms && matchesPrice && matchesAmenities && matchesMoveInDate;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        bedroomFilter={bedroomFilter}
        setBedroomFilter={setBedroomFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        moveInDate={moveInDate}
        setMoveInDate={setMoveInDate}
        onSearch={handleSearch}
      />

      {/* Results Header with View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
          <p className="text-gray-600 mt-1">
            {filteredProperties.length} properties found
          </p>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-md"
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('map')}
            className="rounded-md"
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'map' ? (
        <PropertyMap 
          properties={filteredProperties}
          onPropertySelect={handlePropertySelect}
        />
      ) : (
        <>
          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onToggleFavorite={toggleFavorite}
                  onAddToComparison={addToComparison}
                  isFavorited={favorites.has(property.id)}
                  isInComparison={comparison.includes(property.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesGrid;
