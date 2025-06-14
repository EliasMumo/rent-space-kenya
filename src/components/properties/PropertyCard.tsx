
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Heart, 
  MessageSquare, 
  MapPin, 
  Bed, 
  Bath,
  Home,
  Star,
  Phone,
  Eye
} from "lucide-react";

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

interface PropertyCardProps {
  property: Property;
  onContact?: (property: Property) => void;
  showActions?: boolean;
}

const PropertyCard = ({ property, onContact, showActions = true }: PropertyCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save properties to favorites",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id);

        if (error) throw error;
        setIsFavorited(false);
        toast({ title: "Removed from favorites" });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            property_id: property.id
          }]);

        if (error) throw error;
        setIsFavorited(true);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPhone = () => {
    if (!property.profiles) return null;
    
    if (property.profiles.display_phone_preference === 'caretaker' && property.profiles.caretaker_phone) {
      return property.profiles.caretaker_phone;
    }
    return property.profiles.phone;
  };

  const displayPhone = getDisplayPhone();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <Home className="h-16 w-16 text-purple-400" />
        </div>
        {showActions && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 ${isFavorited ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            onClick={handleFavorite}
            disabled={loading}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
        )}
        <Badge className="absolute top-2 left-2 bg-white/90 text-purple-700">
          {property.property_type}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
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
                {property.bedrooms}
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms}
              </div>
            </div>
          </div>

          {property.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {property.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {property.is_furnished && (
              <Badge variant="outline" className="text-xs">Furnished</Badge>
            )}
            {property.is_pet_friendly && (
              <Badge variant="outline" className="text-xs">Pet Friendly</Badge>
            )}
            {property.amenities?.slice(0, 2).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities?.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 2} more
              </Badge>
            )}
          </div>

          {property.profiles && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={property.profiles.avatar_url} />
                  <AvatarFallback>
                    {property.profiles.first_name[0]}{property.profiles.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {property.profiles.first_name} {property.profiles.last_name}
                  </p>
                  {displayPhone && (
                    <p className="text-xs text-gray-600 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {displayPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onContact?.(property)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
