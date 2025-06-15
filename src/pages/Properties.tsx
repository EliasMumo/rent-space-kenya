
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Bell, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PropertySearch from "@/components/search/PropertySearch";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyComparison from "@/components/comparison/PropertyComparison";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  is_available: boolean;
  amenities: string[];
  images: string[];
  created_at: string;
  landlord_id: string;
  view_count?: number;
  inquiry_count?: number;
}

const Properties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [comparison, setComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetchProperties();
    if (user) {
      fetchFavorites();
      fetchUnreadNotifications();
    }
  }, [user]);

  const fetchProperties = async (filters?: any) => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_available', true);

      if (filters) {
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.propertyType) {
          query = query.eq('property_type', filters.propertyType);
        }
        if (filters.minPrice > 0) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice < 200000) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.bedrooms.min > 0) {
          query = query.gte('bedrooms', filters.bedrooms.min);
        }
        if (filters.bedrooms.max < 10) {
          query = query.lte('bedrooms', filters.bedrooms.max);
        }
        if (filters.isFurnished !== null) {
          query = query.eq('is_furnished', filters.isFurnished);
        }
        if (filters.isPetFriendly !== null) {
          query = query.eq('is_pet_friendly', filters.isPetFriendly);
        }
        if (filters.amenities?.length > 0) {
          query = query.overlaps('amenities', filters.amenities);
        }
        if (filters.query) {
          query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error && data) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', user.id);
    
    if (data) {
      setFavorites(new Set(data.map(f => f.property_id)));
    }
  };

  const fetchUnreadNotifications = async () => {
    if (!user) return;
    
    const { count } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    setUnreadNotifications(count || 0);
  };

  const toggleFavorite = async (propertyId: string, isFavorited: boolean) => {
    if (!user) return;

    if (isFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      if (!error) {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          property_id: propertyId
        });
      
      if (!error) {
        setFavorites(prev => new Set([...prev, propertyId]));
      }
    }
  };

  const addToComparison = (propertyId: string) => {
    if (comparison.length >= 4) {
      alert('You can compare up to 4 properties at once');
      return;
    }
    
    if (!comparison.includes(propertyId)) {
      setComparison(prev => [...prev, propertyId]);
    }
  };

  const removeFromComparison = (propertyId: string) => {
    setComparison(prev => prev.filter(id => id !== propertyId));
  };

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
              {comparison.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowComparison(!showComparison)}
                  className="relative"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Compare
                  <Badge variant="destructive" className="ml-2 text-xs">
                    {comparison.length}
                  </Badge>
                </Button>
              )}
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs min-w-[20px] h-5">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
                <NotificationCenter
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>
              
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <PropertySearch onSearch={fetchProperties} loading={loading} />
        </div>

        {/* Comparison Section */}
        {showComparison && comparison.length > 0 && (
          <div className="mb-8">
            <PropertyComparison
              propertyIds={comparison}
              onRemoveProperty={removeFromComparison}
              onClose={() => setShowComparison(false)}
            />
          </div>
        )}

        {/* Properties Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Properties ({properties.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-600">No properties found</p>
              <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onToggleFavorite={toggleFavorite}
                  onAddToComparison={addToComparison}
                  isFavorited={favorites.has(property.id)}
                  isInComparison={comparison.includes(property.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
