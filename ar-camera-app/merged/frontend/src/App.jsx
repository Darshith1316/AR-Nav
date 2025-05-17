import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import MapPreviewCard from './components/Dashboard/MapPreviewCard';
import ActiveRouteCard from './components/Dashboard/ActiveRouteCard';
import SafetyAlertsCard from './components/Dashboard/SafetyAlertsCard';
import QuickActionsCard from './components/Dashboard/QuickActionsCard';
import AiRecommendationsCard from './components/Dashboard/AiRecommendationsCard';
import MapDisplay from './components/MapDisplay';
import AlertsPage from './components/AlertsPage';

// Placeholder components for other pages
const RoutePlanningPage = () => <div className="p-4 w-full max-w-md mx-auto bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold text-blue-700">Route Planning</h1><p className="mt-2">Route planning interface will be implemented here.</p><Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">&larr; Back to Dashboard</Link></div>;

const SettingsPage = () => (
  <div className="p-4 w-full max-w-md mx-auto bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-bold text-blue-700 mb-4">Settings</h1>
    
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-semibold text-lg mb-2 text-blue-600">App Preferences</h2>
      <p className="text-gray-600 text-sm">General application settings will appear here in a future update (e.g., map style, notification sounds).</p>
    </div>

    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-semibold text-lg mb-2 text-blue-600">Privacy</h2>
      <p className="text-gray-600 text-sm">Review our privacy practices and manage your data settings.</p>
      {/* In a real app, link to the actual privacy policy document */}
      <a href="/privacy_policy.md" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-1 inline-block">View Privacy Policy</a>
    </div>

    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="font-semibold text-lg mb-2 text-blue-600">Feedback</h2>
      <p className="text-gray-600 text-sm">We value your input! Please let us know how we can improve Fortify Vision.</p>
      <a href="mailto:feedback@fortify.vision?subject=Fortify Vision App Feedback" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center inline-block text-sm">
        Send Feedback via Email
      </a>
      <p className="text-xs text-gray-500 mt-1">(Opens your default email client)</p>
    </div>

    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-2 text-blue-600">About</h2>
      <p className="text-gray-600 text-sm">Fortify Vision - Version 1.0</p>
      <p className="text-gray-600 text-sm">Your intelligent navigation companion.</p>
      {/* In a real app, link to the actual user guide */}
      <a href="/USER_GUIDE.md" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-1 inline-block">View User Guide</a>
    </div>

    <Link to="/" className="text-blue-600 hover:text-blue-800 mt-6 inline-block">&larr; Back to Dashboard</Link>
  </div>
);

const Dashboard = () => (
  <main className="w-full max-w-md flex-grow overflow-y-auto p-4 bg-white sm:rounded-b-lg shadow-md">
    <MapPreviewCard />
    <ActiveRouteCard isActive={false} />
    <SafetyAlertsCard alertCount={3} />
    <QuickActionsCard />
    <AiRecommendationsCard />
  </main>
);

function App() {
  return (
    <Router>
      <div className="app-container bg-gray-100 min-h-screen flex flex-col items-center p-0 sm:p-4">
        <header className="w-full max-w-md bg-blue-600 text-white p-4 sm:rounded-t-lg flex justify-between items-center shadow-md sticky top-0 z-50">
          <button className="text-2xl focus:outline-none">
            &#9776;
          </button>
          <h1 className="text-xl font-bold">Fortify Vision</h1>
          <Link to="/settings" className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </header>

        <div className="w-full max-w-md flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapDisplay />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/route-planning" element={<RoutePlanningPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
        
        <nav className="w-full max-w-md bg-white border-t border-gray-200 p-2 flex justify-around sticky bottom-0 sm:rounded-b-lg shadow-top-md mt-auto">
          <Link to="/" className="text-gray-600 hover:text-blue-700 flex flex-col items-center px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" title="Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link to="/map" className="text-gray-600 hover:text-blue-700 flex flex-col items-center px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" title="Map">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159-1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>
            <span className="text-xs mt-1">Map</span>
          </Link>
          <Link to="/alerts" className="text-gray-600 hover:text-blue-700 flex flex-col items-center px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" title="Alerts">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
            <span className="text-xs mt-1">Alerts</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;

