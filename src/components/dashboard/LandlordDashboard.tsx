
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Home, 
  Eye, 
  MessageSquare, 
  Users,
  TrendingUp,
  Settings,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react";
import { User } from "@/hooks/useAuth";
import PropertyForm from "../properties/PropertyForm";

interface LandlordDashboardProps {
  user: User;
}

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
  views?: number;
  inquiries?: number;
}

const LandlordDashboard = ({ user }: LandlordDashboardProps) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [user.id]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties",
          variant: "destructive"
        });
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyCreated = () => {
    setShowPropertyForm(false);
    fetchProperties();
  };

  const togglePropertyAvailability = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_available: !currentStatus })
        .eq('id', propertyId);

      if (error) {
        console.error('Error updating property:', error);
        toast({
          title: "Error",
          description: "Failed to update property status",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `Property ${!currentStatus ? 'listed' : 'unlisted'} successfully`
      });
      
      fetchProperties();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Error deleting property:', error);
        toast({
          title: "Error",
          description: "Failed to delete property",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Property deleted successfully"
      });
      
      fetchProperties();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.is_available).length;
  const rentedProperties = properties.filter(p => !p.is_available).length;

  const getStatusColor = (status: boolean) => {
    return status 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">Your listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProperties}</div>
            <p className="text-xs text-muted-foreground">Ready for rent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rented</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentedProperties}</div>
            <p className="text-xs text-muted-foreground">Occupied units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KSh {properties.filter(p => !p.is_available).reduce((sum, p) => sum + p.price, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From rented properties</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your properties and listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Property</DialogTitle>
                </DialogHeader>
                <PropertyForm onSuccess={handlePropertyCreated} />
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties Management */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Properties ({totalProperties})</TabsTrigger>
            <TabsTrigger value="available">Available ({availableProperties})</TabsTrigger>
            <TabsTrigger value="rented">Rented ({rentedProperties})</TabsTrigger>
          </TabsList>
          <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <TabsContent value="all" className="space-y-4">
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No properties yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first property listing</p>
              <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="grid gap-4">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                          <Home className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <p className="text-gray-600">{property.location}</p>
                          <p className="font-medium text-green-600">
                            KSh {property.price.toLocaleString()}/month
                          </p>
                          <Badge className={`${getStatusColor(property.is_available)} capitalize`}>
                            {getStatusIcon(property.is_available)}
                            <span className="ml-1">{property.is_available ? 'Available' : 'Rented'}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {property.views || 0} views
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {property.inquiries || 0} inquiries
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => togglePropertyAvailability(property.id, property.is_available)}
                          >
                            {property.is_available ? 'Mark as Rented' : 'Mark as Available'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteProperty(property.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available">
          <div className="grid gap-4">
            {properties.filter(p => p.is_available).map((property) => (
              <Card key={property.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                        <Home className="h-8 w-8 text-purple-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-gray-600">{property.location}</p>
                        <p className="font-medium text-green-600">
                          KSh {property.price.toLocaleString()}/month
                        </p>
                        <Badge className={`${getStatusColor(property.is_available)} capitalize`}>
                          {getStatusIcon(property.is_available)}
                          <span className="ml-1">{property.is_available ? 'Available' : 'Rented'}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {property.views || 0} views
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {property.inquiries || 0} inquiries
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {properties.filter(p => p.is_available).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No available properties</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rented">
          <div className="grid gap-4">
            {properties.filter(p => !p.is_available).map((property) => (
              <Card key={property.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                        <Home className="h-8 w-8 text-purple-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-gray-600">{property.location}</p>
                        <p className="font-medium text-green-600">
                          KSh {property.price.toLocaleString()}/month
                        </p>
                        <Badge className={`${getStatusColor(property.is_available)} capitalize`}>
                          {getStatusIcon(property.is_available)}
                          <span className="ml-1">{property.is_available ? 'Available' : 'Rented'}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {property.views || 0} views
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {property.inquiries || 0} inquiries
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {properties.filter(p => !p.is_available).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No rented properties</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandlordDashboard;
