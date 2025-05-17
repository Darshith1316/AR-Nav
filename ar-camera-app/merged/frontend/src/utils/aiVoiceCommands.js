// Replace the simulated AI voice commands with real API calls
import { processVoiceCommand } from '../api';

// Process voice command and return appropriate response
export const processVoiceInput = async (voiceText) => {
  try {
    // Send the voice command to the API
    const response = await processVoiceCommand(voiceText);
    
    return {
      success: response.success,
      message: response.message,
      action: response.action,
      data: response.data
    };
  } catch (error) {
    console.error("Error in processVoiceInput:", error);
    // Fallback response
    return {
      success: false,
      message: "Error processing voice command. Please try again.",
      action: null,
      data: null
    };
  }
};

// Simulate listening for voice input (in a real app, this would use the Web Speech API)
export const listenForVoiceCommand = async () => {
  // In a real implementation, this would activate the device microphone
  // For now, we'll use a prompt as a fallback
  const voiceText = prompt("Enter voice command (simulated):");
  
  if (!voiceText) {
    return {
      success: false,
      message: "No voice input detected",
      action: null,
      data: null
    };
  }
  
  // Process the voice command
  return await processVoiceInput(voiceText);
};

// Get available voice commands
export const getAvailableVoiceCommands = () => {
  return [
    {
      command: "Navigate to [destination]",
      description: "Start navigation to a specific destination",
      examples: ["Navigate to downtown", "Navigate to nearest gas station"]
    },
    {
      command: "Report [issue]",
      description: "Report a safety issue or hazard",
      examples: ["Report accident", "Report dangerous road condition"]
    },
    {
      command: "Find recommendations",
      description: "Get safety recommendations for current location",
      examples: ["Find recommendations", "Suggest safety tips"]
    },
    {
      command: "Share my location",
      description: "Share your current location",
      examples: ["Share my location", "Send my location"]
    }
  ];
};

// Check if voice commands are supported on this device
export const isVoiceCommandSupported = () => {
  // In a real app, this would check for Web Speech API support
  return true;
};
