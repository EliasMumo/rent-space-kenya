
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, MapPin, Calendar, Wifi, Car, Shield, Waves } from "lucide-react";

interface PropertyFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  bedroomFilter: string;
  setBedroomFilter: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
  moveInDate: string;
  setMoveInDate: (value: string) => void;
  onSearch: () => void;
}

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "security", label: "Security", icon: Shield },
  { id: "swimming_pool", label: "Swimming Pool", icon: Waves },
  { id: "gym", label: "Gym", icon: MapPin },
  { id: "laundry", label: "Laundry", icon: MapPin },
  { id: "garden", label: "Garden", icon: MapPin },
  { id: "balcony", label: "Balcony", icon: MapPin }
];

const PropertyFilters = ({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  typeFilter,
  setTypeFilter,
  bedroomFilter,
  setBedroomFilter,
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities,
  moveInDate,
  setMoveInDate,
  onSearch
}: PropertyFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(id => id !== amenityId));
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setTypeFilter("");
    setBedroomFilter("");
    setPriceRange([0, 200000]);
    setSelectedAmenities([]);
    setMoveInDate("");
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Basic Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
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

          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Less' : 'More'} Filters
            </Button>
            <Button onClick={onSearch} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-6 space-y-6">
            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-3">Price Range (KSh/month)</h4>
              <div className="px-3">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={200000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>KSh {priceRange[0].toLocaleString()}</span>
                  <span>KSh {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Move-in Date */}
            <div>
              <h4 className="font-medium mb-3">Move-in Date</h4>
              <div className="relative max-w-xs">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-medium mb-3">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={(checked) => 
                          handleAmenityChange(amenity.id, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={amenity.id} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                      >
                        <IconComponent className="h-4 w-4" />
                        {amenity.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                Reset All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;
