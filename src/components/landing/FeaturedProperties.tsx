
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
      description: "Spacious and modern apartment with great views and amenities.",
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
      description: "Beautiful house with a large garden and secure compound.",
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
      description: "Compact and well-maintained studio apartment in a prime location.",
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
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Home className="h-16 w-16 text-purple-400" />
                </div>
                <Badge className="absolute top-2 left-2 bg-white/90 text-purple-700">
                  {property.type}
                </Badge>
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
                      KSh {property.price}/month
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

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={property.landlord.avatar} />
                        <AvatarFallback>{property.landlord.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{property.landlord.name}</p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {property.landlord.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
