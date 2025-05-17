from fastapi import FastAPI, APIRouter, HTTPException
import json
import os
from datetime import datetime
from typing import List, Optional, Dict, Any

# Create the FastAPI app
app = FastAPI(title="Fortify Vision API")

# Load mock data
def load_mock_data(filename):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "mock_data", filename)
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading mock data from {file_path}: {e}")
        return []

# Save mock data
def save_mock_data(filename, data):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "mock_data", filename)
    try:
        with open(file_path, "w") as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving mock data to {file_path}: {e}")
        return False

# Create API router
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

# Routes endpoints
@api_router.get("/routes")
async def get_routes():
    routes = load_mock_data("routes.json")
    return routes

@api_router.get("/routes/{route_id}")
async def get_route(route_id: int):
    routes = load_mock_data("routes.json")
    for route in routes:
        if route["id"] == route_id:
            return route
    raise HTTPException(status_code=404, detail="Route not found")

@api_router.post("/routes")
async def create_route(route: Dict[str, Any]):
    routes = load_mock_data("routes.json")
    # Generate new ID
    new_id = max([r["id"] for r in routes], default=0) + 1
    route["id"] = new_id
    route["created_at"] = datetime.now().isoformat()
    route["updated_at"] = datetime.now().isoformat()
    routes.append(route)
    save_mock_data("routes.json", routes)
    return route

@api_router.put("/routes/{route_id}")
async def update_route(route_id: int, route: Dict[str, Any]):
    routes = load_mock_data("routes.json")
    for i, r in enumerate(routes):
        if r["id"] == route_id:
            route["id"] = route_id
            route["created_at"] = r["created_at"]
            route["updated_at"] = datetime.now().isoformat()
            routes[i] = route
            save_mock_data("routes.json", routes)
            return route
    raise HTTPException(status_code=404, detail="Route not found")

@api_router.delete("/routes/{route_id}")
async def delete_route(route_id: int):
    routes = load_mock_data("routes.json")
    for i, route in enumerate(routes):
        if route["id"] == route_id:
            del routes[i]
            save_mock_data("routes.json", routes)
            return {"message": "Route deleted successfully"}
    raise HTTPException(status_code=404, detail="Route not found")

# Alerts endpoints
@api_router.get("/alerts")
async def get_alerts(is_read: Optional[bool] = None):
    alerts = load_mock_data("alerts.json")
    if is_read is not None:
        alerts = [a for a in alerts if a["is_read"] == is_read]
    return alerts

@api_router.get("/alerts/{alert_id}")
async def get_alert(alert_id: int):
    alerts = load_mock_data("alerts.json")
    for alert in alerts:
        if alert["id"] == alert_id:
            return alert
    raise HTTPException(status_code=404, detail="Alert not found")

@api_router.post("/alerts")
async def create_alert(alert: Dict[str, Any]):
    alerts = load_mock_data("alerts.json")
    # Generate new ID
    new_id = max([a["id"] for a in alerts], default=0) + 1
    alert["id"] = new_id
    alert["created_at"] = datetime.now().isoformat()
    alerts.append(alert)
    save_mock_data("alerts.json", alerts)
    return alert

@api_router.put("/alerts/{alert_id}")
async def update_alert(alert_id: int, alert: Dict[str, Any]):
    alerts = load_mock_data("alerts.json")
    for i, a in enumerate(alerts):
        if a["id"] == alert_id:
            alert["id"] = alert_id
            alert["created_at"] = a["created_at"]
            alerts[i] = alert
            save_mock_data("alerts.json", alerts)
            return alert
    raise HTTPException(status_code=404, detail="Alert not found")

@api_router.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: int):
    alerts = load_mock_data("alerts.json")
    for i, alert in enumerate(alerts):
        if alert["id"] == alert_id:
            del alerts[i]
            save_mock_data("alerts.json", alerts)
            return {"message": "Alert deleted successfully"}
    raise HTTPException(status_code=404, detail="Alert not found")

# Locations endpoints
@api_router.get("/locations")
async def get_locations(limit: int = 10):
    locations = load_mock_data("locations.json")
    return locations[:limit]

@api_router.post("/locations")
async def update_location(location_data: Dict[str, Any]):
    locations = load_mock_data("locations.json")
    # Generate new ID
    new_id = max([l["id"] for l in locations], default=0) + 1
    location = {
        "id": new_id,
        "user_id": "default_user",
        "location": location_data.get("location", {"lat": 0, "lng": 0, "address": ""}),
        "speed": location_data.get("speed", 0),
        "heading": location_data.get("heading", 0),
        "accuracy": location_data.get("accuracy", 0),
        "timestamp": datetime.now().isoformat()
    }
    locations.append(location)
    save_mock_data("locations.json", locations)
    return location

# Recommendations endpoints
@api_router.get("/recommendations")
async def get_recommendations(limit: int = 5):
    recommendations = load_mock_data("recommendations.json")
    return recommendations[:limit]

@api_router.get("/recommendations/route/{route_id}")
async def get_route_recommendations(route_id: int):
    recommendations = load_mock_data("recommendations.json")
    route_recommendations = [r for r in recommendations if r.get("related_route_id") == route_id]
    return route_recommendations

# Voice commands endpoint
@api_router.post("/voice-commands")
async def process_voice_command(command_data: Dict[str, Any]):
    command = command_data.get("command", "")
    # Mock response based on command
    if "navigate" in command.lower():
        return {
            "success": True,
            "action": "navigation",
            "message": f"Starting navigation based on command: {command}"
        }
    elif "alert" in command.lower() or "warning" in command.lower():
        return {
            "success": True,
            "action": "alert",
            "message": f"Checking for alerts based on command: {command}"
        }
    else:
        return {
            "success": True,
            "action": "unknown",
            "message": f"Command received: {command}"
        }

# MILITARY FEATURES

# Threats endpoints
@api_router.get("/threats")
async def get_threats():
    threats = load_mock_data("threats.json")
    return threats

@api_router.get("/threats/{threat_id}")
async def get_threat(threat_id: int):
    threats = load_mock_data("threats.json")
    for threat in threats:
        if threat["id"] == threat_id:
            return threat
    raise HTTPException(status_code=404, detail="Threat not found")

@api_router.post("/threats")
async def create_threat(threat: Dict[str, Any]):
    threats = load_mock_data("threats.json")
    # Generate new ID
    new_id = max([t["id"] for t in threats], default=0) + 1
    threat["id"] = new_id
    threat["created_at"] = datetime.now().isoformat()
    threats.append(threat)
    save_mock_data("threats.json", threats)
    return threat

@api_router.put("/threats/{threat_id}")
async def update_threat(threat_id: int, threat: Dict[str, Any]):
    threats = load_mock_data("threats.json")
    for i, t in enumerate(threats):
        if t["id"] == threat_id:
            threat["id"] = threat_id
            threat["created_at"] = t["created_at"]
            threats[i] = threat
            save_mock_data("threats.json", threats)
            return threat
    raise HTTPException(status_code=404, detail="Threat not found")

@api_router.delete("/threats/{threat_id}")
async def delete_threat(threat_id: int):
    threats = load_mock_data("threats.json")
    for i, threat in enumerate(threats):
        if threat["id"] == threat_id:
            del threats[i]
            save_mock_data("threats.json", threats)
            return {"message": "Threat deleted successfully"}
    raise HTTPException(status_code=404, detail="Threat not found")

# Sniper positions endpoint
@api_router.post("/sniper-positions/calculate")
async def calculate_sniper_positions(data: Dict[str, Any]):
    target_location = data.get("target_location", {})
    
    # Mock calculation of optimal sniper positions
    # In a real system, this would use terrain data, line of sight calculations, etc.
    positions = [
        {
            "id": 1,
            "location": {
                "lat": target_location.get("lat", 0) + 0.005,
                "lng": target_location.get("lng", 0) + 0.003,
                "elevation": 45
            },
            "distance_to_target": 450,
            "cover_quality": "excellent",
            "escape_routes": 3,
            "line_of_sight": "clear",
            "score": 92
        },
        {
            "id": 2,
            "location": {
                "lat": target_location.get("lat", 0) - 0.002,
                "lng": target_location.get("lng", 0) + 0.007,
                "elevation": 38
            },
            "distance_to_target": 380,
            "cover_quality": "good",
            "escape_routes": 2,
            "line_of_sight": "partial obstruction",
            "score": 78
        },
        {
            "id": 3,
            "location": {
                "lat": target_location.get("lat", 0) + 0.008,
                "lng": target_location.get("lng", 0) - 0.004,
                "elevation": 52
            },
            "distance_to_target": 520,
            "cover_quality": "excellent",
            "escape_routes": 1,
            "line_of_sight": "clear",
            "score": 85
        }
    ]
    
    return positions

# Safe routes endpoint
@api_router.post("/safe-routes/calculate")
async def calculate_safe_route(data: Dict[str, Any]):
    start_location = data.get("start_location", {})
    end_location = data.get("end_location", {})
    terrain_type = data.get("terrain_type", "urban")
    
    # Mock calculation of safe route
    # In a real system, this would use terrain data, threat assessments, etc.
    
    # Generate waypoints between start and end
    lat_diff = end_location.get("lat", 0) - start_location.get("lat", 0)
    lng_diff = end_location.get("lng", 0) - start_location.get("lng", 0)
    
    waypoints = [
        {
            "lat": start_location.get("lat", 0) + lat_diff * 0.25,
            "lng": start_location.get("lng", 0) + lng_diff * 0.25,
            "address": "Safe Passage Alpha",
            "elevation": 35,
            "terrain": terrain_type,
            "safety_score": 88
        },
        {
            "lat": start_location.get("lat", 0) + lat_diff * 0.5,
            "lng": start_location.get("lng", 0) + lng_diff * 0.5,
            "address": "Safe Passage Bravo",
            "elevation": 40,
            "terrain": terrain_type,
            "safety_score": 92
        },
        {
            "lat": start_location.get("lat", 0) + lat_diff * 0.75,
            "lng": start_location.get("lng", 0) + lng_diff * 0.75,
            "address": "Safe Passage Charlie",
            "elevation": 38,
            "terrain": terrain_type,
            "safety_score": 85
        }
    ]
    
    # Calculate total distance (mock)
    total_distance = 3.2  # km
    
    # Calculate estimated time (mock)
    estimated_time = 40  # minutes
    
    # Calculate overall safety score (mock)
    safety_score = 90  # out of 100
    
    safe_route = {
        "id": 1,
        "start_location": start_location,
        "end_location": end_location,
        "waypoints": waypoints,
        "terrain_type": terrain_type,
        "total_distance": total_distance,
        "estimated_time": estimated_time,
        "safety_score": safety_score,
        "created_at": datetime.now().isoformat()
    }
    
    # Save to mock data
    safe_routes = load_mock_data("safe_routes.json")
    safe_routes.append(safe_route)
    save_mock_data("safe_routes.json", safe_routes)
    
    return safe_route

# Include the router in the app
app.include_router(api_router)

# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo purposes only, in production specify domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run the app with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
