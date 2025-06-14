
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
}

const PropertyMap = ({ properties, onPropertySelect }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2hpdGVmbG9yZSIsImEiOiJjbWJ3bTN2dTIxMDZvMmtzMTZ1eTRqM284In0.tZP3Yyy522QbJw_a5rSc0g';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [36.8219, -1.2921], // Nairobi coordinates
      zoom: 11,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !properties.length) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each property
    properties.forEach((property) => {
      // Generate random coordinates around Nairobi for demo
      // In a real app, you'd geocode the actual addresses
      const lat = -1.2921 + (Math.random() - 0.5) * 0.1;
      const lng = 36.8219 + (Math.random() - 0.5) * 0.1;

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white shadow-lg">
          ${property.bedrooms}
        </div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'property-popup'
      }).setHTML(`
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
          <p class="text-xs text-gray-600 mb-2">${property.location}</p>
          <div class="flex justify-between items-center">
            <span class="font-bold text-green-600">KSh ${property.price.toLocaleString()}/mo</span>
            <span class="text-xs bg-gray-100 px-2 py-1 rounded">${property.bedrooms}BR</span>
          </div>
        </div>
      `);

      // Add click event to marker
      markerElement.addEventListener('click', () => {
        setSelectedProperty(property);
        onPropertySelect?.(property);
        popup.addTo(map.current!);
        marker.setPopup(popup);
      });

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach(() => {
        const lat = -1.2921 + (Math.random() - 0.5) * 0.1;
        const lng = 36.8219 + (Math.random() - 0.5) * 0.1;
        bounds.extend([lng, lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [properties, onPropertySelect]);

  return (
    <Card className="overflow-hidden">
      <div className="h-96 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        {properties.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No properties to display on map</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropertyMap;
