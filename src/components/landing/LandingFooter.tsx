
const LandingFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Column 1 */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              RentEase
            </h4>
            <p className="text-sm sm:text-base leading-relaxed">
              Your one-stop platform for finding the perfect rental property in Kenya.
            </p>
          </div>

          {/* Column 2 */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                  Browse Properties
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                  List Your Property
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Contact Information
            </h4>
            <ul className="space-y-2">
              <li>
                <p className="text-sm sm:text-base">Email: info@rentease.com</p>
              </li>
              <li>
                <p className="text-sm sm:text-base">Phone: +254 700 000000</p>
              </li>
              <li>
                <p className="text-sm sm:text-base">Address: Nairobi, Kenya</p>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Stay Connected
            </h4>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center border-t border-gray-800 pt-6 sm:pt-8">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} RentEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
