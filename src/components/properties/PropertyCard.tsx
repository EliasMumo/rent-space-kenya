
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Car, Wifi, MessageSquare, Eye, Scale } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import InquiryModal from "@/components/messaging/InquiryModal";

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
  view_count?: number;
  inquiry_count?: number;
}

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (propertyId: string, isFavorited: boolean) => void;
  onAddToComparison: (propertyId: string) => void;
  isFavorited: boolean;
  isInComparison: boolean;
}

const PropertyCard = ({ 
  property, 
  onToggleFavorite, 
  onAddToComparison,
  isFavorited, 
  isInComparison 
}: PropertyCardProps) => {
  const { user } = useAuth();
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const handleViewProperty = async () => {
    // Track property view
    if (user) {
      await supabase
        .from('property_views')
        .insert({
          property_id: property.id,
          user_id: user.id,
          ip_address: null,
          user_agent: navigator.userAgent
        });
    }

    // Increment view count
    await supabase.rpc('increment_property_views', {
      property_uuid: property.id
    });
  };

  const handleContact = () => {
    setShowInquiryModal(true);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'parking':
        return <Car className="h-3 w-3" />;
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="relative">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-48 object-cover rounded-t-lg"
              onClick={handleViewProperty}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id, isFavorited);
              }}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`bg-white/80 hover:bg-white ${isInComparison ? 'bg-blue-100' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToComparison(property.id);
              }}
            >
              <Scale className={`h-4 w-4 ${isInComparison ? 'text-blue-600' : 'text-gray-600'}`} />
            </Button>
          </div>

          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90">
              {property.property_type}
            </Badge>
          </div>

          {property.is_furnished && (
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-green-500">Furnished</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} bath</span>
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {getAmenityIcon(amenity)}
                    <span className="ml-1">{amenity}</span>
                  </Badge>
                ))}
                {property.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-2xl font-bold text-green-600">
                KSh {property.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-600">/month</span>
              </div>
            </div>

            {(property.view_count || property.inquiry_count) && (
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {property.view_count && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{property.view_count} views</span>
                  </div>
                )}
                {property.inquiry_count && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{property.inquiry_count} inquiries</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleViewProperty}>
            View Details
          </Button>
          <Button className="flex-1" onClick={handleContact}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </CardFooter>
      </Card>

      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        property={{
          id: property.id,
          title: property.title,
          landlord_id: property.landlord_id
        }}
        onSuccess={() => {
          console.log('Inquiry sent successfully');
        }}
      />
    </>
  );
};

export default PropertyCard;
