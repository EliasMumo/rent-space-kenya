
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  LogIn,
  CheckCircle,
  TrendingUp,
  Users,
  AlertTriangle
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Home className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">RentKenya</h2>
          <p className="text-blue-200">Loading your experience...</p>
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Home className="h-8 w-8 text-blue-600" />
                <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-20"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                RentKenya
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button 
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <User className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Safety Disclaimer */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="border-red-400 bg-red-50/10 backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-red-200" />
            <AlertTitle className="text-red-100 font-semibold">Important Safety Notice</AlertTitle>
            <AlertDescription className="text-red-100">
              <strong>NEVER pay for a property you haven't physically visited.</strong> Always inspect the property in person before making any payments. Verify the landlord's identity and ownership documents. RentKenya and its owners are not liable for any financial losses resulting from fraudulent transactions.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                Home in Kenya
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover verified rental properties across Kenya. Connect directly with trusted landlords 
              and find your dream home today.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <Card className="p-6 bg-white/95 backdrop-blur border-0 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <Input
                        placeholder="Enter location (e.g., Kilimani, Karen, Westlands)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="h-14 px-6 border-slate-200 hover:bg-slate-50">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </Button>
                  <Button className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <Search className="h-5 w-5 mr-2" />
                    Search Homes
                  </Button>
                </div>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
                <div className="text-slate-300">Verified Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">50,000+</div>
                <div className="text-slate-300">Happy Tenants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">47</div>
                <div className="text-slate-300">Counties Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">Featured Listings</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Properties</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the most sought-after rental homes in prime locations across Kenya
            </p>
          </div>

          {/* Fraud Prevention Notice */}
          <div className="mb-12">
            <Alert className="border-amber-200 bg-amber-50">
              <Shield className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800">Protect Yourself from Fraud</AlertTitle>
              <AlertDescription className="text-amber-700">
                <strong>Before making any payment:</strong> Always visit the property in person, verify the landlord's identity, check ownership documents, and never send money to unverified accounts. Use secure payment methods and get receipts for all transactions.
              </AlertDescription>
            </Alert>
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
              className="px-8 py-3 text-lg border-slate-300 hover:bg-slate-100"
            >
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 px-4 py-2">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The RentKenya Advantage</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the most trusted and efficient way to find rental properties in Kenya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <Shield className="h-16 w-16 text-green-600 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-green-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <CardTitle className="text-2xl text-slate-900">Verified Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  Every property is thoroughly verified by our expert team to ensure quality, 
                  authenticity, and your peace of mind.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <Users className="h-16 w-16 text-blue-600 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <CardTitle className="text-2xl text-slate-900">Direct Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  Connect directly with verified property owners. No middlemen, 
                  no hidden fees - just transparent communication.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <MapPin className="h-16 w-16 text-purple-600 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                </div>
                <CardTitle className="text-2xl text-slate-900">Nationwide Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 text-lg leading-relaxed">
                  From Nairobi to Mombasa, Kisumu to Eldoret - find quality rental 
                  properties in every major city and town across Kenya.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of satisfied tenants who found their perfect rental through RentKenya. 
            Start your journey today - it's completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              className="bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Searching Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
            >
              Already Have an Account?
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer Footer */}
      <section className="bg-slate-800 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Important Disclaimer</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                RentKenya serves as a platform connecting property owners and potential tenants. We are not responsible for any fraudulent activities, misrepresentations, or financial losses that may occur during property transactions.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Users are solely responsible for verifying property details, landlord credentials, and conducting due diligence before entering into any rental agreements or making payments.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Stay Safe</h3>
              <ul className="text-slate-400 space-y-2">
                <li>• Always inspect properties physically before payment</li>
                <li>• Verify landlord identity and ownership documents</li>
                <li>• Use secure payment methods with proper receipts</li>
                <li>• Report suspicious listings or activities immediately</li>
                <li>• Never share personal financial information unsolicited</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-500">
              © 2024 RentKenya. All rights reserved. By using this platform, you agree to our terms of service and acknowledge our liability limitations.
            </p>
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
