import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Sample alert data - in a real app, this would come from a backend or state management
const sampleAlerts = [
  {
    id: 1,
    type: 'Safety',
    title: 'Heavy Traffic Reported Ahead',
    description: 'A major accident has been reported on Main St. Expect significant delays or find an alternative route.',
    location: 'Main St & 1st Ave',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    severity: 'High',
    read: false,
  },
  {
    id: 2,
    type: 'System',
    title: 'Map Data Updated',
    description: 'Offline map data for your region has been successfully updated.',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    severity: 'Low',
    read: true,
  },
  {
    id: 3,
    type: 'Safety',
    title: 'Weather Warning: Thunderstorms',
    description: 'Severe thunderstorms are expected in your area in the next 2 hours. Consider postponing travel.',
    location: 'City Center Area',
    timestamp: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    severity: 'Medium',
    read: false,
  },
];

const AlertsPage = () => {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Time'); // Time or Severity

  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => alert.id === id ? { ...alert, read: true } : alert));
  };

  const filteredAndSortedAlerts = alerts
    .filter(alert => filterType === 'All' || alert.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'Time') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      // Basic severity sort (High > Medium > Low)
      const severityOrder = { High: 3, Medium: 2, Low: 1 };
      return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700 border-red-500';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-500';
      default: return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Alerts</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800">&larr; Back to Dashboard</Link>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="flex-1">
          <label htmlFor="filterType" className="block text-sm font-medium text-gray-700">Filter by Type:</label>
          <select 
            id="filterType" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option>All</option>
            <option>Safety</option>
            <option>System</option>
            {/* Add more types as needed */}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            id="sortBy" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option>Time</option>
            <option>Severity</option>
          </select>
        </div>
      </div>

      {filteredAndSortedAlerts.length === 0 ? (
        <p className="text-gray-600">No alerts to display.</p>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedAlerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-lg shadow border-l-4 ${getSeverityColor(alert.severity)} ${alert.read ? 'opacity-70' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-md">{alert.title}</h3>
                  <p className="text-xs text-gray-500">Type: {alert.type} | Severity: {alert.severity}</p>
                </div>
                {!alert.read && (
                  <button 
                    onClick={() => markAsRead(alert.id)} 
                    className="ml-2 text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
              {alert.location && <p className="text-xs text-gray-500 mt-1">Location: {alert.location}</p>}
              <p className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;

