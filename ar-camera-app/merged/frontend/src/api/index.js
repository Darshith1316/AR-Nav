import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:8000/api';

// Routes API
export const getRoutes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/routes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export const getRoute = async (routeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/routes/${routeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching route ${routeId}:`, error);
    throw error;
  }
};

export const createRoute = async (routeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/routes`, routeData);
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

export const updateRoute = async (routeId, routeData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/routes/${routeId}`, routeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating route ${routeId}:`, error);
    throw error;
  }
};

export const deleteRoute = async (routeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/routes/${routeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting route ${routeId}:`, error);
    throw error;
  }
};

// Alerts API
export const getAlerts = async (isRead) => {
  try {
    const params = isRead !== undefined ? { is_read: isRead } : {};
    const response = await axios.get(`${API_BASE_URL}/alerts`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const getAlert = async (alertId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts/${alertId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching alert ${alertId}:`, error);
    throw error;
  }
};

export const createAlert = async (alertData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/alerts`, alertData);
    return response.data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

export const updateAlert = async (alertId, alertData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/alerts/${alertId}`, alertData);
    return response.data;
  } catch (error) {
    console.error(`Error updating alert ${alertId}:`, error);
    throw error;
  }
};

export const deleteAlert = async (alertId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/alerts/${alertId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting alert ${alertId}:`, error);
    throw error;
  }
};

// User Location API
export const getUserLocations = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/locations`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw error;
  }
};

export const updateUserLocation = async (locationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/locations`, locationData);
    return response.data;
  } catch (error) {
    console.error('Error updating user location:', error);
    throw error;
  }
};

// Recommendations API
export const getRecommendations = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

export const getRouteRecommendations = async (routeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendations/route/${routeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recommendations for route ${routeId}:`, error);
    throw error;
  }
};

// Voice Commands API
export const processVoiceCommand = async (command) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/voice-commands`, { command });
    return response.data;
  } catch (error) {
    console.error('Error processing voice command:', error);
    throw error;
  }
};

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};
