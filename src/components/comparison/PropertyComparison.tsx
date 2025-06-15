
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Scale, MapPin, Bed, Bath, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [propertyIds]);

  const fetchProperties = async () => {
    if (propertyIds.length === 0) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .in('id', propertyIds);

    if (!error && data) {
      setProperties(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading comparison...</div>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Scale className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No properties to compare</p>
            <p className="text-sm">Add properties to start comparing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const comparisonRows = [
    { label: "Property Type", key: "property_type" },
    { label: "Price", key: "price", format: (value: number) => `KSh ${value.toLocaleString()}/month` },
    { label: "Location", key: "location" },
    { label: "Bedrooms", key: "bedrooms" },
    { label: "Bathrooms", key: "bathrooms" },
    { label: "Furnished", key: "is_furnished", format: (value: boolean) => value ? "Yes" : "No" },
    { label: "Pet Friendly", key: "is_pet_friendly", format: (value: boolean) => value ? "Yes" : "No" },
  ];

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
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Feature</th>
                {properties.map((property) => (
                  <th key={property.id} className="text-left p-2 min-w-[200px]">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-2">
                            <Home className="h-8 w-8 text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-2">{property.title}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveProperty(property.id)}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, index) => (
                <tr key={row.key} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="p-2 font-medium">{row.label}</td>
                  {properties.map((property) => {
                    const value = property[row.key as keyof Property];
                    const displayValue = row.format ? row.format(value as any) : value;
                    return (
                      <td key={`${property.id}-${row.key}`} className="p-2">
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-2 font-medium">Amenities</td>
                {properties.map((property) => (
                  <td key={`${property.id}-amenities`} className="p-2">
                    <div className="flex flex-wrap gap-1">
                      {property.amenities?.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyComparison;
