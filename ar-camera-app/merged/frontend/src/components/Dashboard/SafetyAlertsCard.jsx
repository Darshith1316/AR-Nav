import React from 'react';
import { Link } from 'react-router-dom';

const SafetyAlertsCard = ({ alertCount = 0 }) => {
  return (
    <div className="card bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-semibold text-lg mb-2 text-blue-700">Safety Alerts</h2>
      <Link to="/alerts" className="block">
        <div className={`p-3 rounded-md ${alertCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          <p className="font-medium">
            {alertCount} Active Alert{alertCount !== 1 ? 's' : ''}
          </p>
          <p className="text-sm">
            {alertCount > 0 ? 'Tap to view details' : 'All clear for now!'}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SafetyAlertsCard;
