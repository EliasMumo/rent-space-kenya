
const TrustSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
          Trusted By Thousands
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8 md:space-x-16">
          {/* Logo 1 */}
          <div className="flex-shrink-0">
            <img
              src="https://via.placeholder.com/120x60"
              alt="Company Logo"
              className="h-8 sm:h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
            />
          </div>

          {/* Logo 2 */}
          <div className="flex-shrink-0">
            <img
              src="https://via.placeholder.com/120x60"
              alt="Company Logo"
              className="h-8 sm:h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
            />
          </div>

          {/* Logo 3 */}
          <div className="flex-shrink-0">
            <img
              src="https://via.placeholder.com/120x60"
              alt="Company Logo"
              className="h-8 sm:h-12 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity duration-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
