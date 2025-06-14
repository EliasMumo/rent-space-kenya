
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Menu, X } from "lucide-react";

interface LandingHeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const LandingHeader = ({ onLoginClick, onSignUpClick }: LandingHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-transparent to-blue-50/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <Home className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-20"></div>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              RentEase
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Browse Properties</a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">List Property</a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">About</a>
          </nav>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Button 
              variant="outline"
              onClick={onLoginClick}
              className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 text-sm px-4 py-2"
            >
              Login
            </Button>
            <Button 
              onClick={onSignUpClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm px-4 py-2"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col space-y-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors px-2">Browse Properties</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors px-2">List Property</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors px-2">About</a>
            </nav>
            <div className="flex flex-col space-y-3 px-2">
              <Button 
                variant="outline"
                onClick={onLoginClick}
                className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 w-full"
              >
                Login
              </Button>
              <Button 
                onClick={onSignUpClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
