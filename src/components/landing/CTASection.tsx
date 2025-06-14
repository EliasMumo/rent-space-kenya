
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  onSignUpClick: () => void;
}

const CTASection = ({ onSignUpClick }: CTASectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500"></div>
      
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Ready to Find Your Dream Home?
        </h2>
        <p className="text-base sm:text-xl text-purple-100 mb-6 sm:mb-8 leading-relaxed">
          Join thousands of satisfied renters who found their perfect home through RentEase
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            size="lg"
            onClick={onSignUpClick}
            className="w-full sm:w-auto bg-white text-purple-600 hover:bg-slate-50 hover:text-purple-700 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Searching Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
            onClick={() => navigate('/properties')}
          >
            Browse Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
