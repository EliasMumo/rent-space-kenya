
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface LandingHeaderProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
}

const LandingHeader = ({ onLoginClick, onSignUpClick }: LandingHeaderProps) => {
  return (
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
              RentEase
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
              onClick={onLoginClick}
              className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700"
            >
              Login
            </Button>
            <Button 
              onClick={onSignUpClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
