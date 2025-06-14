
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onSignUpClick: () => void;
}

const HeroSection = ({ onSignUpClick }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
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
              onClick={onSignUpClick}
              className="px-8 py-3 text-lg border-purple-300 hover:bg-purple-50 hover:border-purple-400 text-purple-700"
            >
              View All Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
