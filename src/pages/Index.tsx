
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import UserDashboard from "@/components/dashboard/UserDashboard";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturedProperties from "@/components/landing/FeaturedProperties";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TrustSection from "@/components/landing/TrustSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // If user is authenticated, show their dashboard
  if (isAuthenticated && user) {
    return <UserDashboard user={user} />;
  }

  const handleLoginClick = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <LandingHeader 
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
      />
      
      <HeroSection onSignUpClick={handleSignUpClick} />
      
      <FeaturedProperties />
      
      <FeaturesSection />
      
      <TrustSection />
      
      <CTASection onSignUpClick={handleSignUpClick} />
      
      <LandingFooter />

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
