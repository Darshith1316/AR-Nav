import React from 'react';
import { Link } from 'react-router-dom';

const MapPreviewCard = () => {
  return (
    <div className="card bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-semibold text-lg mb-2 text-blue-700">Map Preview</h2>
      <Link to="/map">
        <div className="h-32 bg-blue-100 rounded flex items-center justify-center text-blue-600 relative overflow-hidden">
          {/* Simple map preview with a location marker */}
          <div className="absolute inset-0 bg-blue-50">
            <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
              {/* Simple grid lines to simulate a map */}
              {Array(6).fill().map((_, i) => (
                <div key={`h-${i}`} className="border-t border-blue-200 col-span-6"></div>
              ))}
              {Array(6).fill().map((_, i) => (
                <div key={`v-${i}`} className="border-l border-blue-200 row-span-6"></div>
              ))}
            </div>
            {/* Location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-400 rounded-full opacity-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          <span className="z-10 font-medium">Your Location</span>
        </div>
      </Link>
      <p className="text-sm text-gray-600 mt-2">Tap to open full map</p>
    </div>
  );
};

export default MapPreviewCard;
