
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, X } from "lucide-react";
import AdvancedPropertyFilters from "./AdvancedPropertyFilters";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FilterState {
  location: string;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  bedrooms: { min: number; max: number };
  bathrooms: { min: number; max: number };
  amenities: string[];
  isFurnished: boolean | null;
  isPetFriendly: boolean | null;
}

interface PropertySearchProps {
  onSearch: (filters: FilterState & { query: string }) => void;
  loading?: boolean;
}

const PropertySearch = ({ onSearch, loading }: PropertySearchProps) => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    minPrice: 0,
    maxPrice: 200000,
    propertyType: "",
    bedrooms: { min: 0, max: 10 },
    bathrooms: { min: 0, max: 10 },
    amenities: [],
    isFurnished: null,
    isPetFriendly: null,
  });

  useEffect(() => {
    if (user) {
      fetchSavedSearches();
    }
  }, [user]);

  const fetchSavedSearches = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    setSavedSearches(data || []);
  };

  const handleSearch = () => {
    onSearch({ ...filters, query });
  };

  const handleSaveSearch = async (searchName: string) => {
    if (!user) return;

    const searchCriteria = { ...filters, query };
    
    const { error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        search_name: searchName,
        search_criteria: searchCriteria
      });

    if (!error) {
      fetchSavedSearches();
    }
  };

  const loadSavedSearch = (savedSearch: any) => {
    const criteria = savedSearch.search_criteria;
    setFilters(criteria);
    setQuery(criteria.query || "");
    setShowFilters(false);
  };

  const deleteSavedSearch = async (searchId: string) => {
    await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId);
    
    fetchSavedSearches();
  };

  const hasActiveFilters = () => {
    return filters.location || 
           filters.minPrice > 0 || 
           filters.maxPrice < 200000 ||
           filters.propertyType ||
           filters.bedrooms.min > 0 ||
           filters.bedrooms.max < 10 ||
           filters.bathrooms.min > 0 ||
           filters.bathrooms.max < 10 ||
           filters.amenities.length > 0 ||
           filters.isFurnished !== null ||
           filters.isPetFriendly !== null;
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search properties by location, type, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={hasActiveFilters() ? "bg-blue-50 border-blue-200" : ""}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Active
            </Badge>
          )}
        </Button>
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Quick Location Filters */}
      <div className="flex flex-wrap gap-2">
        {["Kilimani", "Karen", "Westlands", "Runda", "Lavington", "Kileleshwa"].map(location => (
          <Button
            key={location}
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters(prev => ({ ...prev, location }));
              onSearch({ ...filters, location, query });
            }}
            className="text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {location}
          </Button>
        ))}
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Saved Searches:</p>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map((search) => (
              <Badge
                key={search.id}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200 px-3 py-1"
              >
                <span onClick={() => loadSavedSearch(search)}>
                  {search.search_name}
                </span>
                <button
                  onClick={() => deleteSavedSearch(search.id)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <AdvancedPropertyFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSaveSearch={user ? handleSaveSearch : undefined}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};

export default PropertySearch;
