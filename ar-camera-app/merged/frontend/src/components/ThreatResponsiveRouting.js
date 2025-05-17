// Threat-Responsive Smart Routing Frontend Component
// This file implements the frontend interface for the threat-responsive routing system

class ThreatResponsiveRoutingClient {
  constructor() {
    this.apiBaseUrl = '/api/smart-routing';
    this.activeRouteId = null;
    this.routeUpdateInterval = 10000; // Check for route updates every 10 seconds
    this.routeUpdateTimer = null;
    this.onRouteUpdateCallbacks = [];
    this.threatDetectionEnabled = true;
  }

  /**
   * Initialize the routing client
   */
  init() {
    console.log('Initializing Threat-Responsive Smart Routing Client');
    this.getModelInfo()
      .then(info => {
        console.log('Smart Routing Model Info:', info);
      })
      .catch(error => {
        console.error('Failed to get model info:', error);
      });
  }

  /**
   * Calculate an optimal route between two locations
   * @param {Object} startLocation - Starting location {lat, lng}
   * @param {Object} endLocation - Ending location {lat, lng}
   * @param {string} terrainType - Type of terrain (urban, rural, etc.)
   * @returns {Promise<Object>} - Route information
   */
  async calculateRoute(startLocation, endLocation, terrainType = 'urban') {
    try {
      const response = await fetch(`${this.apiBaseUrl}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_location: startLocation,
          end_location: endLocation,
          terrain_type: terrainType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const routeData = await response.json();
      this.activeRouteId = routeData.id;
      
      // Start monitoring for route updates
      this.startRouteUpdateMonitoring();
      
      return routeData;
    } catch (error) {
      console.error('Error calculating route:', error);
      throw error;
    }
  }

  /**
   * Get a specific route by ID
   * @param {number} routeId - ID of the route to retrieve
   * @returns {Promise<Object>} - Route information
   */
  async getRoute(routeId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/routes/${routeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error getting route ${routeId}:`, error);
      throw error;
    }
  }

  /**
   * Get all calculated routes
   * @returns {Promise<Array>} - List of routes
   */
  async getAllRoutes() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/routes`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting all routes:', error);
      throw error;
    }
  }

  /**
   * Report a new threat and trigger route recalculation
   * @param {Object} location - Threat location {lat, lng}
   * @param {string} type - Type of threat
   * @param {string} severity - Severity level (low, medium, high)
   * @returns {Promise<Object>} - Response with affected routes
   */
  async reportThreat(location, type = 'enemy', severity = 'high') {
    try {
      const response = await fetch(`${this.apiBaseUrl}/threats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          type,
          severity,
          reported_by: 'user',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Force an immediate route update check
      if (this.activeRouteId) {
        this.checkForRouteUpdates();
      }
      
      return result;
    } catch (error) {
      console.error('Error reporting threat:', error);
      throw error;
    }
  }

  /**
   * Provide feedback on a route for model improvement
   * @param {number} routeId - ID of the route
   * @param {number} rating - Rating (1-5)
   * @param {string} comments - Optional comments
   * @returns {Promise<Object>} - Response
   */
  async provideRouteFeedback(routeId, rating, comments = '') {
    try {
      const response = await fetch(`${this.apiBaseUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route_id: routeId,
          rating,
          comments
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error providing route feedback:', error);
      throw error;
    }
  }

  /**
   * Get information about the ML model
   * @returns {Promise<Object>} - Model information
   */
  async getModelInfo() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/model-info`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting model info:', error);
      throw error;
    }
  }

  /**
   * Start monitoring for route updates
   */
  startRouteUpdateMonitoring() {
    if (this.routeUpdateTimer) {
      clearInterval(this.routeUpdateTimer);
    }
    
    this.routeUpdateTimer = setInterval(() => {
      if (this.threatDetectionEnabled && this.activeRouteId) {
        this.checkForRouteUpdates();
      }
    }, this.routeUpdateInterval);
    
    console.log('Started route update monitoring');
  }

  /**
   * Stop monitoring for route updates
   */
  stopRouteUpdateMonitoring() {
    if (this.routeUpdateTimer) {
      clearInterval(this.routeUpdateTimer);
      this.routeUpdateTimer = null;
    }
    
    console.log('Stopped route update monitoring');
  }

  /**
   * Check for route updates
   */
  async checkForRouteUpdates() {
    if (!this.activeRouteId) return;
    
    try {
      const updatedRoute = await this.getRoute(this.activeRouteId);
      
      // Check if route was rerouted
      if (updatedRoute.rerouted) {
        console.log('Route was rerouted due to new threats!');
        this.notifyRouteUpdate(updatedRoute);
      }
    } catch (error) {
      console.error('Error checking for route updates:', error);
    }
  }

  /**
   * Register a callback for route updates
   * @param {Function} callback - Function to call when route is updated
   */
  onRouteUpdate(callback) {
    if (typeof callback === 'function') {
      this.onRouteUpdateCallbacks.push(callback);
    }
  }

  /**
   * Notify all registered callbacks about a route update
   * @param {Object} updatedRoute - Updated route information
   */
  notifyRouteUpdate(updatedRoute) {
    this.onRouteUpdateCallbacks.forEach(callback => {
      try {
        callback(updatedRoute);
      } catch (error) {
        console.error('Error in route update callback:', error);
      }
    });
  }

  /**
   * Enable or disable threat detection and automatic rerouting
   * @param {boolean} enabled - Whether threat detection should be enabled
   */
  setThreatDetectionEnabled(enabled) {
    this.threatDetectionEnabled = enabled;
    
    if (enabled) {
      console.log('Threat detection enabled');
      if (this.activeRouteId && !this.routeUpdateTimer) {
        this.startRouteUpdateMonitoring();
      }
    } else {
      console.log('Threat detection disabled');
      this.stopRouteUpdateMonitoring();
    }
  }
}

// Example usage in a map component
class SmartRoutingMapComponent {
  constructor(mapElement) {
    this.mapElement = mapElement;
    this.routingClient = new ThreatResponsiveRoutingClient();
    this.currentRoute = null;
    this.routeLayer = null;
    
    // Initialize the routing client
    this.routingClient.init();
    
    // Register for route updates
    this.routingClient.onRouteUpdate(this.handleRouteUpdate.bind(this));
  }
  
  /**
   * Initialize the map component
   */
  initMap() {
    // Map initialization code would go here
    console.log('Initializing map component');
    
    // Add event listener for threat reporting
    this.mapElement.addEventListener('contextmenu', this.handleMapRightClick.bind(this));
  }
  
  /**
   * Handle right-click on map to report threat
   * @param {Event} event - Click event
   */
  handleMapRightClick(event) {
    // Get coordinates from map click
    const coordinates = this.getCoordinatesFromEvent(event);
    
    // Show threat reporting dialog
    this.showThreatReportingDialog(coordinates);
  }
  
  /**
   * Show dialog for reporting a threat
   * @param {Object} coordinates - Map coordinates {lat, lng}
   */
  showThreatReportingDialog(coordinates) {
    // In a real implementation, this would show a dialog
    console.log('Showing threat reporting dialog for coordinates:', coordinates);
    
    // For demonstration, automatically report a threat
    this.reportThreat(coordinates);
  }
  
  /**
   * Report a threat at the specified coordinates
   * @param {Object} coordinates - Map coordinates {lat, lng}
   */
  reportThreat(coordinates) {
    this.routingClient.reportThreat(coordinates)
      .then(result => {
        console.log('Threat reported successfully:', result);
        // Add threat marker to map
        this.addThreatMarker(coordinates);
      })
      .catch(error => {
        console.error('Failed to report threat:', error);
      });
  }
  
  /**
   * Add a threat marker to the map
   * @param {Object} coordinates - Map coordinates {lat, lng}
   */
  addThreatMarker(coordinates) {
    // In a real implementation, this would add a marker to the map
    console.log('Adding threat marker at coordinates:', coordinates);
  }
  
  /**
   * Calculate a route between two points
   * @param {Object} start - Starting coordinates {lat, lng}
   * @param {Object} end - Ending coordinates {lat, lng}
   */
  calculateRoute(start, end) {
    this.routingClient.calculateRoute(start, end)
      .then(route => {
        console.log('Route calculated successfully:', route);
        this.currentRoute = route;
        this.displayRoute(route);
      })
      .catch(error => {
        console.error('Failed to calculate route:', error);
      });
  }
  
  /**
   * Display a route on the map
   * @param {Object} route - Route information
   */
  displayRoute(route) {
    // In a real implementation, this would display the route on the map
    console.log('Displaying route on map:', route);
    
    // Display safety information
    this.displaySafetyInfo(route);
  }
  
  /**
   * Display safety information for the route
   * @param {Object} route - Route information
   */
  displaySafetyInfo(route) {
    // In a real implementation, this would display safety information
    console.log('Route safety score:', route.safety_score);
  }
  
  /**
   * Handle route update notification
   * @param {Object} updatedRoute - Updated route information
   */
  handleRouteUpdate(updatedRoute) {
    console.log('Route updated due to new threats:', updatedRoute);
    
    // Update the displayed route
    this.currentRoute = updatedRoute;
    this.displayRoute(updatedRoute);
    
    // Show alert to user
    this.showRouteUpdateAlert(updatedRoute);
  }
  
  /**
   * Show alert to user about route update
   * @param {Object} updatedRoute - Updated route information
   */
  showRouteUpdateAlert(updatedRoute) {
    // In a real implementation, this would show an alert to the user
    console.log('ALERT: Route has been updated due to new threats!');
    console.log('New safety score:', updatedRoute.safety_score);
  }
  
  /**
   * Get coordinates from map event
   * @param {Event} event - Map event
   * @returns {Object} - Coordinates {lat, lng}
   */
  getCoordinatesFromEvent(event) {
    // In a real implementation, this would extract coordinates from the map event
    // For demonstration, return random coordinates
    return {
      lat: 34.0522 + (Math.random() - 0.5) * 0.1,
      lng: -118.2437 + (Math.random() - 0.5) * 0.1
    };
  }
  
  /**
   * Toggle threat detection
   * @param {boolean} enabled - Whether threat detection should be enabled
   */
  toggleThreatDetection(enabled) {
    this.routingClient.setThreatDetectionEnabled(enabled);
  }
}

// Export the classes for use in other files
export { ThreatResponsiveRoutingClient, SmartRoutingMapComponent };
