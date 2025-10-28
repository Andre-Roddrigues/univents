"use client";
import React, { useRef, useCallback } from "react";
import { GoogleMap, Polygon, useLoadScript } from "@react-google-maps/api";
import { deliveryPolygon } from "@/config/google-maps-zones";

const mapContainerStyle = {
  width: "100%",
  height: "90vh",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
    },
  ],
};

const DeliveryMap = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API || "",
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    const bounds = new google.maps.LatLngBounds();
    deliveryPolygon.forEach((point) => {
      bounds.extend(point);
    });

    map.fitBounds(bounds);
  }, []);

  if (loadError) {
    return (
      <div className="h-[90vh] flex items-center justify-center text-red-600">
        Erro ao carregar o mapa.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[90vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-300">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onLoad}
        options={options}
      >
        <Polygon
          paths={deliveryPolygon}
          options={{
            fillColor: "#10B981",
            fillOpacity: 0.3,
            strokeColor: "#10B981",
            strokeOpacity: 0.9,
            strokeWeight: 3,
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default DeliveryMap;
