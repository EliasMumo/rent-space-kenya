
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Shield, 
  Home,
  User,
  LogIn
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import UserDashboard from "@/components/dashboard/UserDashboard";
import PropertyCard from "@/components/properties/PropertyCard";

const Index = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState("");

  // Show loading screen while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">RentKenya</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show their dashboard
  if (isAuthenticated && user) {
    return <UserDashboard user={user} />;
  }

  // Sample properties for the landing page
  const featuredProperties = [
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
    },
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                RentKenya
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button 
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <User className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Home in Kenya
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover verified rental properties across Kenya. Connect directly with landlords.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Enter location (e.g., Kilimani, Karen, Westlands)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </div>
                <Button variant="outline" className="h-12 px-6">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </Button>
                <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">Discover the most popular rental homes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
            >
              View More Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RentKenya?</h2>
            <p className="text-xl text-gray-600">The trusted platform for finding rental homes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Verified Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All properties are verified by our team to ensure quality and authenticity.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Direct Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect directly with property owners without middlemen or hidden fees.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>All Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Find properties in every major city and town across Kenya.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Index;
