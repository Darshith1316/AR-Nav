import React from 'react';

const ActiveRouteCard = ({ isActive = false, destination = 'Headquarters', eta = '15 mins' }) => {
  return (
    <div className="card bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-semibold text-lg mb-2 text-blue-700">Active Route</h2>
      {isActive ? (
        <div>
          <p className="text-gray-700"><span className="font-medium">To:</span> {destination}</p>
          <p className="text-gray-700"><span className="font-medium">ETA:</span> {eta}</p>
          <div className="mt-2 flex space-x-2">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm">
              Pause
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">No Active Route</p>
      )}
    </div>
  );
};

export default ActiveRouteCard;
