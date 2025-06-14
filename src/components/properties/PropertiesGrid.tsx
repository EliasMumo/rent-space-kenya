
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

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

  const handleContact = (property: Property) => {
    toast({
      title: "Contact Feature",
      description: "Messaging functionality will be implemented soon!"
    });
  };

  const handleSearch = () => {
    // This function can be enhanced to trigger specific search queries
    console.log('Search triggered with current filters');
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

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
          <p className="text-gray-600 mt-1">
            {filteredProperties.length} properties found
          </p>
        </div>
      </div>

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
              onContact={handleContact}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesGrid;
