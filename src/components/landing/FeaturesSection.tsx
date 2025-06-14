
import { Search, CheckCircle, Heart } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Extensive Property Listings",
      description: "Browse thousands of verified properties across Kenya.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: CheckCircle,
      title: "Verified Landlords",
      description: "We ensure all landlords are verified for your peace of mind.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Heart,
      title: "Personalized Experience",
      description: "Find properties tailored to your specific needs and preferences.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose RentEase?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className={`flex items-center justify-center h-16 w-16 rounded-full ${feature.bgColor} mx-auto mb-4`}>
                  <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
