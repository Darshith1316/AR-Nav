import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default icon fix for Leaflet with Webpack/bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapDisplay = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingActive, setTrackingActive] = useState(false);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([51.505, -0.09], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      mapInstanceRef.current = map;
      console.log("Leaflet map initialized.");
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        console.log("Leaflet map instance removed.");
      }
    };
  }, []);

  useEffect(() => {
    if (trackingActive && mapInstanceRef.current) {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const newLocation = [latitude, longitude];
            setCurrentLocation(newLocation);
            console.log("User location updated:", newLocation, "Accuracy:", accuracy);

            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng(newLocation);
            } else {
              userMarkerRef.current = L.marker(newLocation).addTo(mapInstanceRef.current)
                .bindPopup("You are here.");
            }
            mapInstanceRef.current.setView(newLocation, mapInstanceRef.current.getZoom() || 15);
            
            // Placeholder: Here you would also send location to backend for sharing if that feature is active
            // console.log("TODO: Send location to backend for sharing");

          },
          (error) => {
            console.error("Error getting user location:", error);
            alert(`Error: ${error.message}. Please ensure location services are enabled.`);
            setTrackingActive(false); // Stop tracking on error
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
        setTrackingActive(false);
      }
    } else {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        console.log("Stopped tracking user location.");
      }
    }
  }, [trackingActive]);

  const toggleTracking = () => {
    setTrackingActive(!trackingActive);
  };

  return (
    <div style={{ width: "100%", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
      <div ref={mapContainerRef} style={{ flexGrow: 1 }} className="map-container-actual">
        {/* Map will be rendered here by Leaflet */}
      </div>
      <div style={{ padding: "10px", textAlign: "center", backgroundColor: "#f0f0f0" }}>
        <button 
          onClick={toggleTracking}
          className={`font-bold py-2 px-4 rounded ${trackingActive ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"} text-white`}
        >
          {trackingActive ? "Stop Tracking My Location" : "Start Tracking My Location"}
        </button>
        {currentLocation && (
          <p className="text-sm text-gray-600 mt-2">
            Current Location: Lat: {currentLocation[0].toFixed(5)}, Lng: {currentLocation[1].toFixed(5)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MapDisplay;

