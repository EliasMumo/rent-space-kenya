
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, MapPin, Star, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PropertyCard from "@/components/properties/PropertyCard";

interface MatchedProperty {
  property: {
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
  };
  matchScore: number;
  reasons: string[];
}

interface SmartMatchingProps {
  onToggleFavorite: (propertyId: string, isFavorited: boolean) => void;
  onAddToComparison: (propertyId: string) => void;
  favorites: Set<string>;
  comparison: string[];
}

const SmartMatching = ({ onToggleFavorite, onAddToComparison, favorites, comparison }: SmartMatchingProps) => {
  const { user } = useAuth();
  const [matchedProperties, setMatchedProperties] = useState<MatchedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateSmartMatches = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-property-matching', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error generating smart matches:', error);
        return;
      }

      if (data?.matches) {
        setMatchedProperties(data.matches);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Smart matching error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      generateSmartMatches();
    }
  }, [user]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";
    return "Fair Match";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Smart Property Matching</CardTitle>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              AI-Powered
            </Badge>
          </div>
          <Button 
            onClick={generateSmartMatches} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Analyzing...' : 'Refresh Matches'}
          </Button>
        </div>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {loading && matchedProperties.length === 0 ? (
          <div className="text-center py-8">
            <Loader className="h-8 w-8 mx-auto mb-4 animate-spin text-purple-600" />
            <p className="text-gray-600">Analyzing your preferences...</p>
            <p className="text-sm text-gray-500">Finding the perfect matches for you</p>
          </div>
        ) : matchedProperties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No smart matches available</p>
            <p className="text-sm">Try updating your preferences or check back later</p>
          </div>
        ) : (
          <div className="space-y-6">
            {matchedProperties.map((match) => (
              <div key={match.property.id} className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                {/* Match Score Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchScoreColor(match.matchScore)}`}>
                      {match.matchScore}% Match
                    </div>
                    <Badge variant="outline" className="text-purple-700 border-purple-300">
                      {getMatchScoreText(match.matchScore)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">AI Recommended</span>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</p>
                  <div className="flex flex-wrap gap-2">
                    {match.reasons.map((reason, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Property Card */}
                <PropertyCard
                  property={match.property}
                  onToggleFavorite={onToggleFavorite}
                  onAddToComparison={onAddToComparison}
                  isFavorited={favorites.has(match.property.id)}
                  isInComparison={comparison.includes(match.property.id)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartMatching;
