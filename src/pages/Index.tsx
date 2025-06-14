import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import UserDashboard from "@/components/dashboard/UserDashboard";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Home,
  Star,
  Heart,
  Eye,
  MessageSquare,
  CheckCircle,
  Shield,
  Users,
  Bed,
  Bath,
  ArrowRight,
  Phone
} from "lucide-react";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // If user is authenticated, show their dashboard
  if (isAuthenticated && user) {
    return <UserDashboard user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="relative bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-transparent to-blue-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Browse Properties</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">List Property</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">About</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700"
              >
                Login
              </Button>
              <Button 
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-transparent to-blue-900/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                Rental Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover amazing rental properties across Kenya. From modern apartments to spacious houses, 
              find your next home with ease and confidence.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        placeholder="Search by location, property type, or keywords..."
                        className="h-14 pl-12 text-lg border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input 
                        placeholder="Location (e.g., Kilimani, Nairobi)"
                        className="h-14 pl-12 text-lg border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="h-14 px-6 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </Button>
                </div>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/properties')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setAuthMode('register');
                  setAuthModalOpen(true);
                }}
                className="px-8 py-3 text-lg border-purple-300 hover:bg-purple-50 hover:border-purple-400 text-purple-700"
              >
                View All Properties
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Property Cards - Replace with actual data */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Home className="h-16 w-16 text-purple-400" />
                </div>
                <Badge className="absolute top-2 left-2 bg-white/90 text-purple-700">
                  Apartment
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-purple-600 transition-colors">
                      Modern 2BR Apartment in Kilimani
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Kilimani, Nairobi
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      KSh 55,000/month
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        2
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        2
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    Spacious and modern apartment with great views and amenities.
                  </p>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Furnished</Badge>
                    <Badge variant="outline" className="text-xs">WiFi</Badge>
                    <Badge variant="outline" className="text-xs">Parking</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          +254 712 345678
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

            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Home className="h-16 w-16 text-purple-400" />
                </div>
                <Badge className="absolute top-2 left-2 bg-white/90 text-purple-700">
                  House
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-purple-600 transition-colors">
                      Spacious 3BR House in Karen
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Karen, Nairobi
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      KSh 85,000/month
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        3
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        2.5
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    Beautiful house with a large garden and secure compound.
                  </p>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Pet Friendly</Badge>
                    <Badge variant="outline" className="text-xs">Parking</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Jane Smith</p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          +254 722 222222
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

            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Home className="h-16 w-16 text-purple-400" />
                </div>
                <Badge className="absolute top-2 left-2 bg-white/90 text-purple-700">
                  Studio
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-purple-600 transition-colors">
                      Cozy Studio Apartment in Westlands
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Westlands, Nairobi
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      KSh 30,000/month
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        1
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        1
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    Compact and well-maintained studio apartment in a prime location.
                  </p>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">WiFi</Badge>
                    <Badge variant="outline" className="text-xs">Parking</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>BW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Bob Williams</p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          +254 733 333333
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose RentKenya?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Extensive Property Listings
              </h3>
              <p className="text-gray-600">
                Browse thousands of verified properties across Kenya.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified Landlords
              </h3>
              <p className="text-gray-600">
                We ensure all landlords are verified for your peace of mind.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Experience
              </h3>
              <p className="text-gray-600">
                Find properties tailored to your specific needs and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Trusted By Thousands
          </h2>
          <div className="flex justify-center items-center space-x-8 md:space-x-16">
            {/* Logo 1 */}
            <div>
              <img
                src="https://via.placeholder.com/120x60"
                alt="Company Logo"
                className="h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
            </div>

            {/* Logo 2 */}
            <div>
              <img
                src="https://via.placeholder.com/120x60"
                alt="Company Logo"
                className="h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
            </div>

            {/* Logo 3 */}
            <div>
              <img
                src="https://via.placeholder.com/120x60"
                alt="Company Logo"
                className="h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of satisfied renters who found their perfect home through RentKenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              className="bg-white text-purple-600 hover:bg-slate-50 hover:text-purple-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Searching Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/properties')}
            >
              Browse Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                RentKenya
              </h4>
              <p>
                Your one-stop platform for finding the perfect rental property in Kenya.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Properties
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    List Your Property
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Contact Information
              </h4>
              <ul className="space-y-2">
                <li>
                  <p>Email: info@rentkenya.com</p>
                </li>
                <li>
                  <p>Phone: +254 700 000000</p>
                </li>
                <li>
                  <p>Address: Nairobi, Kenya</p>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Stay Connected
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p>
              &copy; {new Date().getFullYear()} RentKenya. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

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
