
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter } from "lucide-react";

interface TenantSearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
}

const TenantSearchSection = ({ searchQuery, setSearchQuery, recentSearches }: TenantSearchSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Your Perfect Home</CardTitle>
        <CardDescription>Search for rental properties across Kenya</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter location (e.g., Kilimani, Karen, Westlands)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Recent Searches:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TenantSearchSection;
