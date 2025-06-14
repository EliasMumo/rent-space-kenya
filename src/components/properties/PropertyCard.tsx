
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Bed, Bath, Wifi, Car, Shield, Droplets, Heart } from "lucide-react";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  rating: number;
  reviews: number;
  amenities: string[];
  available: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wi-fi':
        return <Wifi className="h-3 w-3" />;
      case 'parking':
        return <Car className="h-3 w-3" />;
      case 'security':
        return <Shield className="h-3 w-3" />;
      case 'water':
        return <Droplets className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg bg-white">
      <div className="relative overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.available && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              Available
            </Badge>
          )}
        </div>
        
        {/* Heart Icon */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-600 hover:text-red-500 shadow-lg backdrop-blur-sm"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-slate-900">{property.rating}</span>
          <span className="text-xs text-slate-600">({property.reviews})</span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors duration-200">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-slate-500 mt-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{property.bedrooms}</span>
            <span>bed{property.bedrooms > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{property.bathrooms}</span>
            <span>bath{property.bathrooms > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200">
              {getAmenityIcon(amenity)}
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">
                KSh {property.price.toLocaleString()}
              </span>
              <span className="text-slate-500 text-sm">/month</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
