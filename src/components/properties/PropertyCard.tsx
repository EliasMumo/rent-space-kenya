
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, Home, Bed, Bath, MessageSquare, Eye, Heart, 
  Scale, Phone, Share2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  onToggleFavorite?: (propertyId: string, isFavorited: boolean) => void;
  onAddToComparison?: (propertyId: string) => void;
  isFavorited?: boolean;
  isInComparison?: boolean;
}

const PropertyCard = ({ 
  property, 
  onToggleFavorite, 
  onAddToComparison,
  isFavorited = false,
  isInComparison = false 
}: PropertyCardProps) => {
  const { user } = useAuth();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [landlordInfo, setLandlordInfo] = useState<any>(null);

  const handleViewProperty = async () => {
    // Record property view
    await supabase.from('property_views').insert({
      property_id: property.id,
      user_id: user?.id || null,
      ip_address: null, // Could get from request if needed
      user_agent: navigator.userAgent
    });

    // Increment view count
    await supabase.rpc('increment_property_views', {
      property_uuid: property.id
    });
  };

  const handleContactLandlord = async () => {
    if (!landlordInfo) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', property.landlord_id)
        .single();
      
      setLandlordInfo(data);
    }
    setShowInquiryModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title} in ${property.location}`,
          url: window.location.href + `/property/${property.id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href + `/property/${property.id}`);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <div 
            className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center cursor-pointer"
            onClick={handleViewProperty}
          >
            <Home className="h-16 w-16 text-purple-400" />
          </div>
          <Badge className="absolute top-2 left-2 bg-white/90 text-purple-700 text-xs">
            {property.property_type}
          </Badge>
          <div className="absolute top-2 right-2 flex gap-1">
            {user && onToggleFavorite && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(property.id, !isFavorited);
                }}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          {property.view_count && (
            <Badge className="absolute bottom-2 left-2 bg-black/70 text-white text-xs">
              <Eye className="h-3 w-3 mr-1" />
              {property.view_count} views
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-purple-600 transition-colors">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                KSh {property.price.toLocaleString()}/month
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">
              {property.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {property.amenities?.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
              ))}
              {property.amenities?.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-sm"
                onClick={handleContactLandlord}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
              
              {user && onAddToComparison && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToComparison(property.id)}
                  disabled={isInComparison}
                  className="text-sm"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  {isInComparison ? 'Added' : 'Compare'}
                </Button>
              )}
              
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
                onClick={handleViewProperty}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
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
          // Could show a success message here
        }}
      />
    </>
  );
};

export default PropertyCard;
