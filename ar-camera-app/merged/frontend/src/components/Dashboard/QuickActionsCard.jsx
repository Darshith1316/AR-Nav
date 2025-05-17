import React from 'react';
import { Link } from 'react-router-dom';

const QuickActionsCard = () => {
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
          alert(`Sharing your current location: ${locationString} (Placeholder - in a real app, this would be sent to a server).`);
          console.log('User location for sharing:', { latitude, longitude });
          // Placeholder: Send to backend API or WebSocket
          // For example: fetch("/api/share-location", { method: "POST", body: JSON.stringify({ latitude, longitude }) });
        },
        (error) => {
          console.error("Error getting current location for sharing:", error);
          alert(`Error: ${error.message}. Could not retrieve location for sharing.`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="card bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-semibold text-lg mb-2 text-blue-700">Quick Actions</h2>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Link to="/route-planning" className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center">
          Start New Route
        </Link>
        <button 
          onClick={handleShareLocation} 
          className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Share My Location
        </button>
        {/* Add more actions as needed, e.g., Report Incident */}
      </div>
    </div>
  );
};

export default QuickActionsCard;
