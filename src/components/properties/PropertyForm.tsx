
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { X, Plus, Upload, MapPin } from "lucide-react";

interface PropertyFormData {
  title: string;
  description: string;
  property_type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  is_furnished: boolean;
  is_pet_friendly: boolean;
  amenities: string[];
}

interface PropertyFormProps {
  onSuccess?: () => void;
}

const PropertyForm = ({ onSuccess }: PropertyFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");
  
  const form = useForm<PropertyFormData>({
    defaultValues: {
      title: "",
      description: "",
      property_type: "",
      location: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      is_furnished: false,
      is_pet_friendly: false,
      amenities: []
    }
  });

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a property",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .insert([{
          ...data,
          landlord_id: user.id,
          amenities,
          is_available: true
        }]);

      if (error) {
        console.error('Error creating property:', error);
        toast({
          title: "Error",
          description: "Failed to create property. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Property created successfully!"
      });

      form.reset();
      setAmenities([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Add New Property
        </CardTitle>
        <CardDescription>
          Fill in the details below to list your property for rent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Modern 2BR Apartment in Kilimani" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="e.g., Kilimani, Nairobi" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent (KSh)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50000" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your property, its features, and what makes it special..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amenities</label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add amenity (e.g., WiFi, Parking)"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAmenity(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="furnished"
                  {...form.register("is_furnished")}
                />
                <label htmlFor="furnished" className="text-sm">Furnished</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pet_friendly"
                  {...form.register("is_pet_friendly")}
                />
                <label htmlFor="pet_friendly" className="text-sm">Pet Friendly</label>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? 'Creating Property...' : 'Create Property'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
