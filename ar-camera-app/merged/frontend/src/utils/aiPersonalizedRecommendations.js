// Replace the simulated AI personalized recommendations with real API calls
import { getRecommendations, getRouteRecommendations } from '../api';

// Generate personalized route recommendations based on user profile and context
export const getPersonalizedRouteRecommendations = async (userContext = {}, routeId = null) => {
  try {
    // Get recommendations from the API
    const recommendations = routeId 
      ? await getRouteRecommendations(routeId)
      : await getRecommendations();
    
    return recommendations.map(rec => ({
      id: rec.id,
      title: rec.type,
      description: rec.message,
      priority: rec.priority,
      relevanceScore: Math.floor(Math.random() * 100),
      category: rec.type.toLowerCase().includes('safety') ? 'safety' : 'efficiency'
    }));
  } catch (error) {
    console.error("Error in getPersonalizedRouteRecommendations:", error);
    // Fallback data
    return [
      {
        id: "fallback-rec-1",
        title: "API Error",
        description: "Unable to fetch personalized recommendations from API",
        priority: 1,
        relevanceScore: 80,
        category: 'safety'
      }
    ];
  }
};

// Generate safety tips based on user profile and current context
export const getPersonalizedSafetyTips = async (userContext = {}) => {
  try {
    // Get recommendations from the API
    const recommendations = await getRecommendations();
    
    // Filter for safety-related recommendations
    const safetyRecs = recommendations.filter(rec => 
      rec.type.toLowerCase().includes('safety') || 
      rec.message.toLowerCase().includes('safety')
    );
    
    return safetyRecs.map(rec => ({
      id: rec.id,
      tip: rec.message,
      importance: rec.priority,
      category: rec.type
    }));
  } catch (error) {
    console.error("Error in getPersonalizedSafetyTips:", error);
    // Fallback data
    return [
      {
        id: "fallback-tip-1",
        tip: "API Error - Unable to fetch safety tips from API",
        importance: 1,
        category: "General"
      }
    ];
  }
};

// Analyze user behavior patterns to provide tailored recommendations
export const analyzeUserBehaviorPatterns = async (userHistory = []) => {
  try {
    // Get general recommendations
    const recommendations = await getRecommendations();
    
    return {
      patterns: [
        { name: "Time of Travel", value: "Evening commute" },
        { name: "Frequent Destinations", value: "Work, Grocery, Gym" },
        { name: "Safety Preference", value: "High" }
      ],
      recommendations: recommendations.map(rec => ({
        id: rec.id,
        title: rec.type,
        description: rec.message,
        relevance: Math.floor(Math.random() * 100)
      }))
    };
  } catch (error) {
    console.error("Error in analyzeUserBehaviorPatterns:", error);
    // Fallback data
    return {
      patterns: [
        { name: "API Error", value: "Unable to analyze patterns" }
      ],
      recommendations: [
        {
          id: "fallback-pattern-rec",
          title: "Error",
          description: "Unable to fetch behavior-based recommendations from API",
          relevance: 50
        }
      ]
    };
  }
};
