
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Home, Bed, Bath, MessageSquare, Eye, Phone } from "lucide-react";

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      title: "Modern 2BR Apartment in Kilimani",
      location: "Kilimani, Nairobi",
      price: "55,000",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      description: "Spacious and modern apartment with great views and premium amenities in the heart of Kilimani, Nairobi.",
      amenities: ["Furnished", "WiFi", "Parking"],
      landlord: {
        name: "John Doe",
        phone: "+254 712 345678",
        avatar: "https://github.com/shadcn.png",
        initials: "SC"
      }
    },
    {
      id: 2,
      title: "Spacious 3BR House in Karen",
      location: "Karen, Nairobi",
      price: "85,000",
      type: "House",
      bedrooms: 3,
      bathrooms: 2.5,
      description: "Beautiful house with a large garden and secure compound in the prestigious Karen area of Nairobi.",
      amenities: ["Pet Friendly", "Parking"],
      landlord: {
        name: "Jane Smith",
        phone: "+254 722 222222",
        avatar: "https://github.com/shadcn.png",
        initials: "JD"
      }
    },
    {
      id: 3,
      title: "Cozy Studio Apartment in Westlands",
      location: "Westlands, Nairobi",
      price: "30,000",
      type: "Studio",
      bedrooms: 1,
      bathrooms: 1,
      description: "Compact and well-maintained studio apartment in a prime location in Westlands, perfect for young professionals.",
      amenities: ["WiFi", "Parking"],
      landlord: {
        name: "Bob Williams",
        phone: "+254 733 333333",
        avatar: "https://github.com/shadcn.png",
        initials: "BW"
      }
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50" aria-labelledby="featured-properties-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="featured-properties-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
          Featured Rental Properties in Kenya
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property) => (
            <article key={property.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center" role="img" aria-label={`${property.type} in ${property.location}`}>
                    <Home className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400" aria-hidden="true" />
                  </div>
                  <Badge className="absolute top-2 left-2 bg-white/90 text-purple-700 text-xs">
                    {property.type}
                  </Badge>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg line-clamp-2 hover:text-purple-600 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm mt-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" aria-hidden="true" />
                        {property.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg sm:text-2xl font-bold text-green-600">
                        KSh {property.price}/month
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600">
                        <div className="flex items-center" title={`${property.bedrooms} bedrooms`}>
                          <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1" aria-hidden="true" />
                          <span className="text-xs sm:text-sm">{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center" title={`${property.bathrooms} bathrooms`}>
                          <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1" aria-hidden="true" />
                          <span className="text-xs sm:text-sm">{property.bathrooms}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex flex-wrap gap-1" role="list" aria-label="Property amenities">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs" role="listitem">{amenity}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarImage src={property.landlord.avatar} alt={`${property.landlord.name} profile`} />
                          <AvatarFallback className="text-xs">{property.landlord.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs sm:text-sm font-medium">{property.landlord.name}</p>
                          <p className="text-xs text-gray-600 flex items-center">
                            <Phone className="h-2 w-2 sm:h-3 sm:w-3 mr-1" aria-hidden="true" />
                            {property.landlord.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" aria-label={`Contact ${property.landlord.name} about this property`}>
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
                        Contact
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs sm:text-sm" aria-label={`View details for ${property.title}`}>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" aria-hidden="true" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
