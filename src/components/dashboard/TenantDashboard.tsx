
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Heart, 
  MessageSquare, 
  MapPin, 
  Filter,
  Star,
  Bed,
  Bath,
  Calendar
} from "lucide-react";
import { User } from "@/hooks/useAuth";
import PropertyCard from "@/components/properties/PropertyCard";

interface TenantDashboardProps {
  user: User;
}

const TenantDashboard = ({ user }: TenantDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const savedProperties = [
    {
      id: 1,
      title: "Modern 2BR Apartment in Kilimani",
      location: "Kilimani, Nairobi",
      price: 55000,
      bedrooms: 2,
      bathrooms: 2,
      images: ["/placeholder.svg"],
      rating: 4.8,
      reviews: 24,
      amenities: ["Wi-Fi", "Parking", "Water", "Security"],
      available: true
    }
  ];

  const recentSearches = [
    "2BR apartments in Westlands",
    "Houses in Karen under 80k",
    "Bedsitter in Kasarani"
  ];

  const suggestedProperties = [
    {
      id: 2,
      title: "Spacious 3BR House in Karen",
      location: "Karen, Nairobi",
      price: 85000,
      bedrooms: 3,
      bathrooms: 3,
      images: ["/placeholder.svg"],
      rating: 4.9,
      reviews: 18,
      amenities: ["Wi-Fi", "Garden", "Parking", "Security"],
      available: true
    },
    {
      id: 3,
      title: "1BR Apartment in Westlands",
      location: "Westlands, Nairobi",
      price: 35000,
      bedrooms: 1,
      bathrooms: 1,
      images: ["/placeholder.svg"],
      rating: 4.5,
      reviews: 12,
      amenities: ["Wi-Fi", "Parking", "Water"],
      available: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedProperties.length}</div>
            <p className="text-xs text-muted-foreground">Properties you've liked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSearches.length}</div>
            <p className="text-xs text-muted-foreground">Search queries this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Unread conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Home</CardTitle>
          <CardDescription>Search for rental properties across Kenya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter location (e.g., Kilimani, Karen, Westlands)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Recent Searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="suggested" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggested">Suggested Properties</TabsTrigger>
          <TabsTrigger value="saved">Saved Properties</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Properties You Might Like</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Saved Properties</h3>
            <Badge variant="secondary">{savedProperties.length} saved</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recently Viewed</h3>
            <Button variant="outline" size="sm">Clear History</Button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recently viewed properties</p>
            <p className="text-sm">Properties you view will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard;
