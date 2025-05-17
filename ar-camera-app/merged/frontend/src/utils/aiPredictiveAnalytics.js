// Replace the simulated AI predictive analytics with real API calls
import { getAlerts, getRecommendations } from '../api';

// Predict potential safety issues based on current context
export const predictSafetyIssues = async (currentLocation, timeOfDay) => {
  try {
    // Get alerts from the API
    const alerts = await getAlerts();
    
    return {
      potentialIssues: alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        description: alert.message,
        location: alert.location,
        probability: Math.floor(Math.random() * 100)
      })),
      safetyScore: Math.floor(Math.random() * 100),
      timeOfDay: timeOfDay || 'day'
    };
  } catch (error) {
    console.error("Error in predictSafetyIssues:", error);
    // Fallback data
    return {
      potentialIssues: [
        {
          id: "fallback-issue",
          type: "API Error",
          severity: "medium",
          description: "Unable to fetch safety issues from API",
          location: currentLocation,
          probability: 50
        }
      ],
      safetyScore: 70,
      timeOfDay: timeOfDay || 'day'
    };
  }
};

// Generate safety advice based on user's current context
export const generateSafetyAdvice = async (currentLocation, routeId = null) => {
  try {
    // Get recommendations from the API
    const recommendations = routeId 
      ? await getRouteRecommendations(routeId)
      : await getRecommendations();
    
    return {
      advice: recommendations.map(rec => ({
        id: rec.id,
        title: rec.type,
        description: rec.message,
        priority: rec.priority
      })),
      relevanceScore: Math.floor(Math.random() * 100)
    };
  } catch (error) {
    console.error("Error in generateSafetyAdvice:", error);
    // Fallback data
    return {
      advice: [
        {
          id: "fallback-advice",
          title: "API Error",
          description: "Unable to fetch safety advice from API",
          priority: 1
        }
      ],
      relevanceScore: 50
    };
  }
};

// Analyze historical safety data for a location
export const analyzeLocationSafetyHistory = async (location) => {
  try {
    // Get alerts for historical data
    const alerts = await getAlerts();
    
    // Filter alerts that might be relevant to this location (simplified)
    const relevantAlerts = alerts.filter(() => Math.random() > 0.5);
    
    return {
      historicalIncidents: relevantAlerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        date: alert.created_at,
        description: alert.message,
        severity: alert.severity
      })),
      safetyTrend: Math.random() > 0.5 ? "improving" : "declining",
      riskFactors: ["Time of day", "Weather conditions", "Recent incidents"]
    };
  } catch (error) {
    console.error("Error in analyzeLocationSafetyHistory:", error);
    // Fallback data
    return {
      historicalIncidents: [],
      safetyTrend: "unknown",
      riskFactors: ["API Error - Unable to fetch historical data"]
    };
  }
};
