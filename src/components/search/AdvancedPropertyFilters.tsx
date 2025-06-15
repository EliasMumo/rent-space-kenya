
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Filter, Save } from "lucide-react";

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

interface AdvancedPropertyFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSaveSearch?: (searchName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AMENITIES = [
  "WiFi", "Parking", "Swimming Pool", "Gym", "Security", "Generator", 
  "Water Supply", "Elevator", "Balcony", "Garden", "CCTV", "Playground"
];

const PROPERTY_TYPES = [
  "Apartment", "House", "Studio", "Townhouse", "Villa", "Penthouse"
];

const AdvancedPropertyFilters = ({ 
  filters, 
  onFiltersChange, 
  onSaveSearch,
  isOpen, 
  onClose 
}: AdvancedPropertyFiltersProps) => {
  const [searchName, setSearchName] = useState("");
  const [showSaveSearch, setShowSaveSearch] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const handleSaveSearch = () => {
    if (searchName.trim() && onSaveSearch) {
      onSaveSearch(searchName.trim());
      setSearchName("");
      setShowSaveSearch(false);
    }
  };

  const clearFilters = () => {
    onFiltersChange({
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
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter location (e.g., Kilimani, Karen)"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div>
          <Label>Price Range (KSh)</Label>
          <div className="space-y-2">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => {
                updateFilter('minPrice', min);
                updateFilter('maxPrice', max);
              }}
              min={0}
              max={200000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>KSh {filters.minPrice.toLocaleString()}</span>
              <span>KSh {filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <Label>Property Type</Label>
          <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {PROPERTY_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Bedrooms</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.bedrooms.min || ""}
                onChange={(e) => updateFilter('bedrooms', { ...filters.bedrooms, min: parseInt(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.bedrooms.max || ""}
                onChange={(e) => updateFilter('bedrooms', { ...filters.bedrooms, max: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>
          <div>
            <Label>Bathrooms</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.bathrooms.min || ""}
                onChange={(e) => updateFilter('bathrooms', { ...filters.bathrooms, min: parseInt(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.bathrooms.max || ""}
                onChange={(e) => updateFilter('bathrooms', { ...filters.bathrooms, max: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="furnished"
              checked={filters.isFurnished === true}
              onCheckedChange={(checked) => updateFilter('isFurnished', checked ? true : null)}
            />
            <Label htmlFor="furnished">Furnished</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pet-friendly"
              checked={filters.isPetFriendly === true}
              onCheckedChange={(checked) => updateFilter('isPetFriendly', checked ? true : null)}
            />
            <Label htmlFor="pet-friendly">Pet Friendly</Label>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {AMENITIES.map(amenity => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
              </div>
            ))}
          </div>
          {filters.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.amenities.map(amenity => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                  <button onClick={() => toggleAmenity(amenity)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Clear All
          </Button>
          {onSaveSearch && (
            <Button 
              variant="outline" 
              onClick={() => setShowSaveSearch(!showSaveSearch)}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Search
            </Button>
          )}
          <Button onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>

        {/* Save Search Form */}
        {showSaveSearch && (
          <div className="border-t pt-4">
            <Label htmlFor="search-name">Search Name</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="search-name"
                placeholder="Enter search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <Button onClick={handleSaveSearch} disabled={!searchName.trim()}>
                Save
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedPropertyFilters;
