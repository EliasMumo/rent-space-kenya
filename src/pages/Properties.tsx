import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertiesGrid from "@/components/properties/PropertiesGrid";

const Properties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="relative">
                  <Home className="h-8 w-8 text-blue-600" />
                  <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-20"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
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
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            View All Properties
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Please sign in to browse available rental properties
          </p>
          <Button 
            onClick={() => {
              setAuthMode('register');
              setAuthModalOpen(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Get Started
          </Button>
        </div>

        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="relative">
                <Home className="h-8 w-8 text-blue-600" />
                <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-20"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                RentKenya
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName}
              </span>
            </div>
          </div>
        </div>
      </header>

      <PropertiesGrid />
    </div>
  );
};

export default Properties;
