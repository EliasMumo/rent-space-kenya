
import { Search, CheckCircle, Heart } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Extensive Property Listings",
      description: "Browse thousands of verified rental properties across Kenya including apartments, houses, and studios in prime locations.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: CheckCircle,
      title: "Verified Landlords",
      description: "We thoroughly verify all landlords and property owners for your safety and peace of mind when renting in Kenya.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Heart,
      title: "Personalized Experience",
      description: "Find rental properties tailored to your specific needs, budget, and location preferences across Nairobi and beyond.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
          Why Choose RentEase for Your Kenya Rental Search?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <article key={index} className="text-center p-4">
                <div className={`flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full ${feature.bgColor} mx-auto mb-3 sm:mb-4`} aria-hidden="true">
                  <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
