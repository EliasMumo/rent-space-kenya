
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "./PropertyCard";
import { Search, Filter, MapPin, Home } from "lucide-react";

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
  const [priceRange, setPriceRange] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");

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

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchQuery === "" || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "" || 
      property.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = typeFilter === "" || property.property_type === typeFilter;
    
    const matchesBedrooms = bedroomFilter === "" || 
      property.bedrooms.toString() === bedroomFilter;
    
    let matchesPrice = true;
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      matchesPrice = property.price >= min && (max ? property.price <= max : true);
    }

    return matchesSearch && matchesLocation && matchesType && matchesBedrooms && matchesPrice;
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
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="kilimani">Kilimani</SelectItem>
                  <SelectItem value="karen">Karen</SelectItem>
                  <SelectItem value="westlands">Westlands</SelectItem>
                  <SelectItem value="lavington">Lavington</SelectItem>
                  <SelectItem value="kileleshwa">Kileleshwa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Price</SelectItem>
                  <SelectItem value="0-30000">Under 30K</SelectItem>
                  <SelectItem value="30000-50000">30K - 50K</SelectItem>
                  <SelectItem value="50000-80000">50K - 80K</SelectItem>
                  <SelectItem value="80000-120000">80K - 120K</SelectItem>
                  <SelectItem value="120000">120K+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

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
