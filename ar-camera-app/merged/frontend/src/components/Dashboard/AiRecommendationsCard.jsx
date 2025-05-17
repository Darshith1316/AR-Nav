import React from 'react';

const AiRecommendationsCard = () => {
  // Placeholder for AI-driven recommendations
  const recommendations = [
    "Traffic is light on your usual commute route.",
    "Consider a walk in Central Park, weather is great!",
    "Reminder: Check tire pressure this week."
  ];
  const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];

  return (
    <div className="card bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold text-lg mb-2 text-blue-700">AI Recommendations</h2>
      <div className="p-3 bg-purple-100 rounded-md text-purple-700">
        <p className="text-sm italic">{randomRecommendation}</p>
      </div>
    </div>
  );
};

export default AiRecommendationsCard;
