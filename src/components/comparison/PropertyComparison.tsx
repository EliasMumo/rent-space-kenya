
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Scale, MapPin, Bed, Bath, Home, Check, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  amenities: string[];
  images: string[];
}

interface PropertyComparisonProps {
  propertyIds: string[];
  onRemoveProperty: (propertyId: string) => void;
  onClose: () => void;
}

const PropertyComparison = ({ propertyIds, onRemoveProperty, onClose }: PropertyComparisonProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propertyIds.length > 0) {
      fetchProperties();
    }
  }, [propertyIds]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds);

      if (!error && data) {
        setProperties(data as Property[]);
      }
    } catch (error) {
      console.error('Error fetching properties for comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureValue = (property: Property, feature: string) => {
    switch (feature) {
      case 'price':
        return `KSh ${property.price.toLocaleString()}`;
      case 'bedrooms':
        return property.bedrooms;
      case 'bathrooms':
        return property.bathrooms;
      case 'furnished':
        return property.is_furnished ? 'Yes' : 'No';
      case 'petFriendly':
        return property.is_pet_friendly ? 'Yes' : 'No';
      case 'type':
        return property.property_type;
      case 'location':
        return property.location;
      default:
        return '-';
    }
  };

  const hasAmenity = (property: Property, amenity: string) => {
    return property.amenities?.includes(amenity) || false;
  };

  const allAmenities = [...new Set(properties.flatMap(p => p.amenities || []))];

  const comparisonFeatures = [
    { key: 'price', label: 'Monthly Rent', icon: Home },
    { key: 'type', label: 'Property Type', icon: Home },
    { key: 'location', label: 'Location', icon: MapPin },
    { key: 'bedrooms', label: 'Bedrooms', icon: Bed },
    { key: 'bathrooms', label: 'Bathrooms', icon: Bath },
    { key: 'furnished', label: 'Furnished', icon: Home },
    { key: 'petFriendly', label: 'Pet Friendly', icon: Home },
  ];

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center">Loading comparison...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Property Comparison ({properties.length})
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Property Headers */}
            <div className="grid gap-4 p-6 border-b" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div className="font-medium">Features</div>
              {properties.map((property) => (
                <div key={property.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{property.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveProperty(property.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  {property.images && property.images.length > 0 && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-20 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Comparison Features */}
            <div className="divide-y">
              {comparisonFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.key}
                    className="grid gap-4 p-4"
                    style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
                  >
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <Icon className="h-4 w-4" />
                      {feature.label}
                    </div>
                    {properties.map((property) => (
                      <div key={property.id} className="text-sm">
                        {getFeatureValue(property, feature.key)}
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Amenities Comparison */}
              {allAmenities.length > 0 && (
                <>
                  <div
                    className="grid gap-4 p-4 bg-gray-50"
                    style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
                  >
                    <div className="font-medium text-sm">Amenities</div>
                    {properties.map((property) => (
                      <div key={property.id} className="text-sm font-medium">
                        {property.amenities?.length || 0} amenities
                      </div>
                    ))}
                  </div>
                  
                  {allAmenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="grid gap-4 p-4"
                      style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
                    >
                      <div className="text-sm pl-4">{amenity}</div>
                      {properties.map((property) => (
                        <div key={property.id} className="flex items-center">
                          {hasAmenity(property, amenity) ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyComparison;
