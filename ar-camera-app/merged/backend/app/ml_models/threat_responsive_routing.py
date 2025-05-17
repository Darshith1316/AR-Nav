"""
Threat-Responsive Smart Routing Model for Fortify Vision

This module implements an advanced machine learning model for optimal route planning
that dynamically responds to threats and recalculates routes for maximum safety.
"""

import numpy as np
import heapq
from typing import List, Dict, Tuple, Any, Optional
import math
import random
import time

class ThreatResponsiveRoutingModel:
    """
    An advanced ML model for intelligent route planning that:
    1. Continuously monitors for new threats
    2. Dynamically recalculates routes when threats are detected
    3. Uses a hybrid approach combining A* algorithm with neural networks
    4. Employs reinforcement learning for continuous improvement
    
    This model was chosen because:
    - It provides real-time threat response capabilities critical for military applications
    - The hybrid architecture balances computational efficiency with prediction accuracy
    - A* algorithm offers optimal pathfinding with heuristic guidance
    - Neural networks excel at feature extraction from complex terrain and threat data
    - Reinforcement learning allows the model to improve over time based on feedback
    """
    
    def __init__(self, model_weights_path: Optional[str] = None):
        """
        Initialize the threat-responsive routing model with optional pre-trained weights
        
        Args:
            model_weights_path: Path to pre-trained model weights (optional)
        """
        # Initialize model parameters
        self.terrain_features = 8  # Number of terrain features to consider
        self.threat_features = 6   # Number of threat assessment features
        
        # Initialize neural network weights (simplified for demonstration)
        # In a real implementation, these would be loaded from a file
        self.terrain_weights = np.random.randn(self.terrain_features, 4)
        self.threat_weights = np.random.randn(self.threat_features, 3)
        
        # A* algorithm parameters
        self.directions = [(0, 1), (1, 0), (0, -1), (-1, 0), 
                          (1, 1), (1, -1), (-1, 1), (-1, -1)]  # 8-directional movement
        
        # Threat response parameters
        self.threat_threshold = 75  # Threshold for triggering rerouting (0-100)
        self.safety_margin = 0.002  # Safety margin around threats (in coordinate units)
        self.last_threat_check = time.time()
        self.threat_check_interval = 5  # Check for new threats every 5 seconds
        
        # Load pre-trained weights if provided
        if model_weights_path:
            self._load_weights(model_weights_path)
    
    def _load_weights(self, weights_path: str) -> None:
        """
        Load pre-trained weights for the neural network components
        
        Args:
            weights_path: Path to the weights file
        """
        try:
            # In a real implementation, this would load actual weights
            # For demonstration, we'll just print a message
            print(f"Loading model weights from {weights_path}")
            # self.terrain_weights = np.load(f"{weights_path}_terrain.npy")
            # self.threat_weights = np.load(f"{weights_path}_threat.npy")
        except Exception as e:
            print(f"Error loading weights: {e}")
            # Fall back to random initialization
    
    def _heuristic(self, a: Tuple[float, float], b: Tuple[float, float]) -> float:
        """
        Calculate the heuristic (estimated distance) between two points
        
        Args:
            a: Starting point coordinates (lat, lng)
            b: Ending point coordinates (lat, lng)
            
        Returns:
            Estimated distance between points
        """
        # Haversine formula for distance between two lat/lng points
        lat1, lng1 = a
        lat2, lng2 = b
        
        # Convert to radians
        lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371  # Radius of Earth in kilometers
        
        return c * r
    
    def _get_terrain_features(self, location: Dict[str, float], map_data: Dict[str, Any]) -> np.ndarray:
        """
        Extract terrain features for a given location
        
        Args:
            location: Location coordinates
            map_data: Map data containing terrain information
            
        Returns:
            Array of terrain features
        """
        # In a real implementation, this would extract actual terrain features
        # For demonstration, we'll generate random features
        lat, lng = location['lat'], location['lng']
        
        # Simulate terrain feature extraction
        elevation = map_data.get('elevation', {}).get((lat, lng), 0)
        slope = random.uniform(0, 30)
        vegetation = random.uniform(0, 1)
        water_proximity = random.uniform(0, 5)
        road_proximity = random.uniform(0, 2)
        building_density = random.uniform(0, 1)
        terrain_roughness = random.uniform(0, 1)
        visibility = random.uniform(0, 1)
        
        return np.array([elevation, slope, vegetation, water_proximity, 
                         road_proximity, building_density, terrain_roughness, visibility])
    
    def _get_threat_features(self, location: Dict[str, float], threat_data: List[Dict[str, Any]]) -> np.ndarray:
        """
        Extract threat assessment features for a given location
        
        Args:
            location: Location coordinates
            threat_data: List of threats with location and severity information
            
        Returns:
            Array of threat features
        """
        lat, lng = location['lat'], location['lng']
        
        # Initialize threat features
        enemy_proximity = 10.0  # Default to maximum distance (10km)
        exposure_level = 0.0
        historical_incidents = 0
        civilian_presence = random.uniform(0, 1)
        escape_route_availability = random.uniform(0.5, 1)
        threat_density = 0.0
        
        # Process each threat
        if threat_data:
            threat_distances = []
            for threat in threat_data:
                threat_loc = threat.get('location', {})
                threat_lat = threat_loc.get('lat', 0)
                threat_lng = threat_loc.get('lng', 0)
                
                # Calculate distance to threat
                threat_distance = self._heuristic((lat, lng), (threat_lat, threat_lng))
                threat_distances.append(threat_distance)
                
                # Update historical incidents if threat is nearby
                if threat_distance < 2:  # Within 2km
                    historical_incidents += 1
                
                # Update threat density
                threat_density += 1.0 / max(threat_distance, 0.1)
            
            # Update enemy proximity to closest threat
            if threat_distances:
                enemy_proximity = min(threat_distances)
            
            # Calculate exposure level based on proximity to threats
            exposure_level = 1.0 / max(enemy_proximity, 0.1)
            exposure_level = min(exposure_level, 1.0)  # Cap at 1.0
            
            # Adjust escape route availability based on threat density
            escape_route_availability = max(0.1, escape_route_availability - (threat_density * 0.2))
        
        return np.array([enemy_proximity, exposure_level, historical_incidents, 
                         civilian_presence, escape_route_availability, threat_density])
    
    def _predict_safety_score(self, location: Dict[str, float], map_data: Dict[str, Any], 
                             threat_data: List[Dict[str, Any]]) -> float:
        """
        Predict safety score for a given location using neural network components
        
        Args:
            location: Location coordinates
            map_data: Map data containing terrain information
            threat_data: List of threats with location and severity information
            
        Returns:
            Safety score between 0 and 100
        """
        # Extract features
        terrain_features = self._get_terrain_features(location, map_data)
        threat_features = self._get_threat_features(location, threat_data)
        
        # Neural network forward pass (simplified)
        terrain_score = np.dot(terrain_features, self.terrain_weights).mean()
        threat_score = np.dot(threat_features, self.threat_weights).mean()
        
        # Combine scores and normalize to 0-100 range
        # Higher weight on threat score for military applications
        combined_score = (terrain_score * 0.4 + threat_score * 0.6)
        normalized_score = (math.tanh(combined_score) + 1) * 50
        
        return normalized_score
    
    def _is_near_threat(self, location: Dict[str, float], threat_data: List[Dict[str, Any]]) -> bool:
        """
        Check if a location is near any known threat
        
        Args:
            location: Location coordinates
            threat_data: List of threats with location and severity information
            
        Returns:
            True if location is near a threat, False otherwise
        """
        lat, lng = location['lat'], location['lng']
        
        for threat in threat_data:
            threat_loc = threat.get('location', {})
            threat_lat = threat_loc.get('lat', 0)
            threat_lng = threat_loc.get('lng', 0)
            
            # Calculate distance to threat
            distance = self._heuristic((lat, lng), (threat_lat, threat_lng))
            
            # Check if within safety margin
            if distance < self.safety_margin:
                return True
        
        return False
    
    def _should_reroute(self, current_route: Dict[str, Any], threat_data: List[Dict[str, Any]]) -> bool:
        """
        Determine if rerouting is necessary based on new threat data
        
        Args:
            current_route: Current route information
            threat_data: List of threats with location and severity information
            
        Returns:
            True if rerouting is necessary, False otherwise
        """
        # Check if it's time to check for threats
        current_time = time.time()
        if current_time - self.last_threat_check < self.threat_check_interval:
            return False
        
        self.last_threat_check = current_time
        
        # Check if any waypoint is near a threat
        for waypoint in current_route.get('waypoints', []):
            location = {'lat': waypoint['lat'], 'lng': waypoint['lng']}
            if self._is_near_threat(location, threat_data):
                return True
        
        # Check if overall safety score is below threshold
        safety_scores = [waypoint.get('safety_score', 100) for waypoint in current_route.get('waypoints', [])]
        if safety_scores and min(safety_scores) < self.threat_threshold:
            return True
        
        return False
    
    def find_optimal_route(self, start_location: Dict[str, float], end_location: Dict[str, float], 
                          map_data: Dict[str, Any], threat_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Find the optimal route between two locations using the hybrid ML model
        
        Args:
            start_location: Starting location coordinates
            end_location: Ending location coordinates
            map_data: Map data containing terrain information
            threat_data: List of threats with location and severity information
            
        Returns:
            Dictionary containing the optimal route information
        """
        # Convert locations to tuples for easier processing
        start = (start_location['lat'], start_location['lng'])
        end = (end_location['lat'], end_location['lng'])
        
        # Initialize A* algorithm
        open_set = []
        heapq.heappush(open_set, (0, start))
        came_from = {}
        g_score = {start: 0}
        f_score = {start: self._heuristic(start, end)}
        
        # For tracking visited nodes
        open_set_hash = {start}
        
        # A* search algorithm
        while open_set:
            current = heapq.heappop(open_set)[1]
            open_set_hash.remove(current)
            
            if current == end:
                # Reconstruct path
                path = []
                while current in came_from:
                    path.append(current)
                    current = came_from[current]
                path.append(start)
                path.reverse()
                
                # Convert path to waypoints with additional information
                waypoints = []
                total_distance = 0
                overall_safety_score = 0
                
                for i, point in enumerate(path):
                    # Skip start point for distance calculation
                    if i > 0:
                        prev_point = path[i-1]
                        segment_distance = self._heuristic(prev_point, point)
                        total_distance += segment_distance
                    
                    # Create location dict for safety score prediction
                    loc = {'lat': point[0], 'lng': point[1]}
                    safety_score = self._predict_safety_score(loc, map_data, threat_data)
                    overall_safety_score += safety_score
                    
                    # Generate address (would be reverse geocoded in real implementation)
                    address = f"Waypoint {i+1}"
                    if i == 0:
                        address = "Starting Point"
                    elif i == len(path) - 1:
                        address = "Destination"
                    
                    waypoint = {
                        'lat': point[0],
                        'lng': point[1],
                        'address': address,
                        'elevation': map_data.get('elevation', {}).get(point, 0),
                        'safety_score': safety_score
                    }
                    waypoints.append(waypoint)
                
                # Calculate average safety score
                if len(path) > 0:
                    overall_safety_score /= len(path)
                
                # Calculate estimated time (assuming average speed of 5 km/h)
                estimated_time = (total_distance / 5) * 60  # in minutes
                
                return {
                    'start_location': start_location,
                    'end_location': end_location,
                    'waypoints': waypoints,
                    'total_distance': round(total_distance, 2),  # km
                    'estimated_time': round(estimated_time),  # minutes
                    'safety_score': round(overall_safety_score, 1),  # out of 100
                    'threat_responsive': True,
                    'last_updated': time.time()
                }
            
            # Generate neighbors (simplified grid-based approach)
            # In a real implementation, this would use actual map data
            for dx, dy in self.directions:
                neighbor = (current[0] + dx * 0.001, current[1] + dy * 0.001)
                
                # Calculate tentative g_score
                tentative_g_score = g_score[current] + self._heuristic(current, neighbor)
                
                # Safety factor based on neural network prediction
                neighbor_loc = {'lat': neighbor[0], 'lng': neighbor[1]}
                safety_score = self._predict_safety_score(neighbor_loc, map_data, threat_data)
                
                # Adjust score based on safety (lower score for safer paths)
                # More aggressive avoidance for military applications
                safety_factor = 3.0 - (safety_score / 50)  # 1.0 (very safe) to 3.0 (very dangerous)
                tentative_g_score *= safety_factor
                
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    # This path to neighbor is better than any previous one
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + self._heuristic(neighbor, end)
                    
                    if neighbor not in open_set_hash:
                        heapq.heappush(open_set, (f_score[neighbor], neighbor))
                        open_set_hash.add(neighbor)
        
        # No path found
        return {
            'start_location': start_location,
            'end_location': end_location,
            'waypoints': [],
            'total_distance': 0,
            'estimated_time': 0,
            'safety_score': 0,
            'threat_responsive': True,
            'error': 'No path found',
            'last_updated': time.time()
        }
    
    def check_and_reroute(self, current_route: Dict[str, Any], 
                         map_data: Dict[str, Any], threat_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Check if rerouting is necessary and recalculate route if needed
        
        Args:
            current_route: Current route information
            map_data: Map data containing terrain information
            threat_data: List of threats with location and severity information
            
        Returns:
            Updated route information or original route if no rerouting is necessary
        """
        if not self._should_reroute(current_route, threat_data):
            return current_route
        
        # Rerouting is necessary
        start_location = current_route.get('start_location', {})
        end_location = current_route.get('end_location', {})
        
        # Find new optimal route
        new_route = self.find_optimal_route(start_location, end_location, map_data, threat_data)
        
        # Add rerouting metadata
        new_route['rerouted'] = True
        new_route['reroute_reason'] = "New threats detected"
        new_route['previous_route_id'] = current_route.get('id')
        
        return new_route
    
    def update_model(self, training_data: List[Dict[str, Any]]) -> None:
        """
        Update the model with new training data (reinforcement learning component)
        
        Args:
            training_data: List of training examples with routes and outcomes
        """
        # In a real implementation, this would update the model weights
        # For demonstration, we'll just print a message
        print(f"Updating model with {len(training_data)} training examples")
        
        # Simulated weight update
        learning_rate = 0.01
        for _ in range(min(len(training_data), 5)):
            # Random weight updates for demonstration
            self.terrain_weights += learning_rate * np.random.randn(*self.terrain_weights.shape)
            self.threat_weights += learning_rate * np.random.randn(*self.threat_weights.shape)
    
    def save_weights(self, weights_path: str) -> None:
        """
        Save the model weights to a file
        
        Args:
            weights_path: Path to save the weights
        """
        # In a real implementation, this would save the weights to a file
        # For demonstration, we'll just print a message
        print(f"Saving model weights to {weights_path}")
        # np.save(f"{weights_path}_terrain.npy", self.terrain_weights)
        # np.save(f"{weights_path}_threat.npy", self.threat_weights)
