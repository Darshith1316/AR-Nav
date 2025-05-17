# Fortify Vision Windows

A comprehensive military-grade navigation and threat assessment system with threat-responsive smart routing capabilities.

## Project Overview

Fortify Vision is an advanced navigation system designed specifically for military applications. It provides real-time route planning with dynamic threat response, ensuring optimal safety while navigating through potentially dangerous environments.

## Key Features

- **Threat-Responsive Smart Routing**: Automatically recalculates routes when new threats are detected
- **Advanced ML Model**: Hybrid architecture combining A* pathfinding with neural networks for terrain analysis and threat assessment
- **Real-time Threat Monitoring**: Continuous background monitoring of active routes for safety concerns
- **Reinforcement Learning**: System improves over time based on feedback and outcomes
- **Military-Specific Features**: Includes sniper position calculation, safe route planning, and threat management

## Technical Architecture

### Backend

- FastAPI-based REST API
- Threat-Responsive Smart Routing ML model
- Mock data handling for demonstration purposes
- Background tasks for continuous threat monitoring

### Frontend

- React-based user interface
- Real-time map visualization
- Threat reporting capabilities
- Route safety information display

## ML Model Details

The project implements a sophisticated threat-responsive smart routing model that dynamically recalculates optimal routes in response to emerging threats. The model uses a hybrid approach combining:

1. **A* Pathfinding Algorithm** - Provides the core pathfinding capability with heuristic guidance
2. **Neural Network Components** - For terrain analysis and threat assessment
3. **Reinforcement Learning Elements** - For continuous model improvement based on feedback

For more detailed information about the ML model and the reasoning behind its selection, please refer to the `ml_model_documentation.md` file.

## Getting Started

### Backend Setup

1. Navigate to the backend directory
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python -m app.main`

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Usage

1. Use the map interface to set start and end locations
2. The system will calculate the optimal route based on safety considerations
3. Report new threats by right-clicking on the map
4. The system will automatically recalculate routes when threats are detected

## License

This project is proprietary and confidential.
