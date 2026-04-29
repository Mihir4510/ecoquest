// Demo AI Service - Perfect for presentations
export class DemoAIService {
  
  // Get personalized eco-advice with realistic responses
  static async getEcoAdvice(userProfile, userLocation = 'campus') {
    const advice = {
      tips: [
        {
          title: "Switch to Reusable Water Bottles",
          description: "Replace single-use plastic bottles with a durable reusable bottle. This simple change can save hundreds of plastic bottles per year!",
          points: 15,
          difficulty: "easy"
        },
        {
          title: "Take the Stairs Challenge",
          description: "Skip elevators and take stairs to your classes. It's great exercise and saves energy while building healthy habits.",
          points: 10,
          difficulty: "easy"
        },
        {
          title: "Campus Tree Planting",
          description: "Join the campus gardening club or organize tree planting events. Trees absorb CO2 and create beautiful green spaces.",
          points: 50,
          difficulty: "medium"
        }
      ]
    };
    
    return advice;
  }

  // AI-powered activity verification with realistic responses
  static async verifyActivity(activityDescription, imageBase64 = null) {
    // Simulate AI analysis based on description
    const description = activityDescription.toLowerCase();
    let verified = true;
    let points = 10;
    let confidence = 0.85;
    let reason = "Activity appears legitimate based on description analysis.";

    if (description.includes('tree') || description.includes('plant')) {
      points = 50;
      confidence = 0.95;
      reason = "Tree planting activity verified - high environmental impact!";
    } else if (description.includes('bike') || description.includes('cycle')) {
      points = 15;
      confidence = 0.90;
      reason = "Cycling activity confirmed - great for reducing carbon footprint!";
    } else if (description.includes('recycle')) {
      points = 20;
      confidence = 0.88;
      reason = "Recycling activity verified - helps reduce waste!";
    } else if (description.includes('energy') || description.includes('save')) {
      points = 12;
      confidence = 0.80;
      reason = "Energy saving activity confirmed - every bit counts!";
    }

    // Check for suspicious patterns
    if (description.includes('fake') || description.includes('test')) {
      verified = false;
      confidence = 0.95;
      reason = "Activity flagged as potentially fraudulent.";
    }

    return {
      verified,
      points,
      confidence,
      reason
    };
  }

  // Generate personalized activity suggestions
  static async getActivitySuggestions(userProfile, weather = 'sunny') {
    const suggestions = {
      suggestions: [
        {
          title: "Campus Cleanup Drive",
          description: "Organize a cleanup event to pick up litter around campus grounds",
          points: 30,
          weather: "any",
          time: "morning",
          location: "campus"
        },
        {
          title: "Energy Audit",
          description: "Check dorm rooms and classrooms for energy-wasting electronics",
          points: 20,
          weather: "any",
          time: "afternoon",
          location: "dorm/classroom"
        },
        {
          title: "Bike to Class Challenge",
          description: "Use bicycle or walking instead of motorized transport for a week",
          points: 75,
          weather: "sunny",
          time: "morning",
          location: "campus"
        },
        {
          title: "Digital Declutter",
          description: "Clean up digital files and unsubscribe from unnecessary emails",
          points: 15,
          weather: "any",
          time: "evening",
          location: "dorm"
        },
        {
          title: "Water Conservation",
          description: "Report water leaks and practice water-saving habits",
          points: 25,
          weather: "any",
          time: "any",
          location: "campus"
        }
      ]
    };
    
    return suggestions;
  }

  // Generate dynamic eco-challenges
  static async generateChallenges(userProfile, campusData = {}) {
    const challenges = {
      challenges: [
        {
          title: "Zero Waste Week",
          description: "Go 7 days without producing any non-recyclable waste. Bring your own containers, avoid single-use items, and compost food scraps.",
          duration: "7 days",
          points: 150,
          difficulty: "hard",
          category: "waste reduction"
        },
        {
          title: "Carbon Footprint Detective",
          description: "Track your daily carbon footprint for 5 days and find 3 ways to reduce it by at least 20%.",
          duration: "5 days",
          points: 100,
          difficulty: "medium",
          category: "awareness"
        },
        {
          title: "Green Commuter Challenge",
          description: "Use only eco-friendly transportation (bike, walk, public transport) for 3 consecutive days.",
          duration: "3 days",
          points: 75,
          difficulty: "medium",
          category: "transportation"
        }
      ]
    };
    
    return challenges;
  }

  // Calculate carbon footprint impact
  static async calculateCarbonImpact(activities) {
    let totalCO2 = 0;
    let totalTrees = 0;
    let totalWater = 0;
    let totalEnergy = 0;

    activities.forEach(activity => {
      switch(activity.type) {
        case 'Tree Planting':
          totalCO2 += 22; // kg CO2 per tree per year
          totalTrees += 1;
          totalWater += 50; // liters saved
          break;
        case 'Cycling':
          totalCO2 += 0.5; // kg CO2 saved per trip
          totalEnergy += 0.1; // kWh saved
          break;
        case 'Recycling':
          totalCO2 += 2; // kg CO2 saved per kg recycled
          totalWater += 10; // liters saved
          break;
        case 'Energy Saving':
          totalCO2 += 1; // kg CO2 saved
          totalEnergy += 0.5; // kWh saved
          break;
        default:
          totalCO2 += 0.5;
      }
    });

    return {
      co2Saved: Math.round(totalCO2 * 10) / 10,
      treesEquivalent: Math.round(totalCO2 / 22),
      waterSaved: totalWater,
      energySaved: Math.round(totalEnergy * 10) / 10,
      impact: `Your activities have saved approximately ${Math.round(totalCO2 * 10) / 10} kg of CO2, equivalent to ${Math.round(totalCO2 / 22)} trees!`
    };
  }

  // AI Chat with realistic responses
  static async chatWithAI(message, userProfile, context = 'general eco-advice') {
    const userMessage = message.toLowerCase();
    let response = "";

    if (userMessage.includes('carbon') || userMessage.includes('footprint')) {
      response = `Great question! Your current carbon footprint from eco-activities is quite impressive. Based on your ${userProfile.points} points, you've likely saved around ${Math.floor(userProfile.points / 10)} kg of CO2! To reduce it further, try cycling to campus (15 points) or organizing campus cleanups (30 points).`;
    } else if (userMessage.includes('tree') || userMessage.includes('plant')) {
      response = `Tree planting is fantastic! Each tree you plant can absorb up to 22 kg of CO2 per year. With your current ${userProfile.stats?.treesPlanted || 0} trees planted, you're making a real difference! Consider joining our campus gardening club for more planting opportunities.`;
    } else if (userMessage.includes('recycle') || userMessage.includes('waste')) {
      response = `Excellent focus on waste reduction! Recycling saves energy and reduces landfill waste. You've recycled ${userProfile.stats?.wasteRecycled || 0} kg so far - keep it up! Try the Zero Waste Week challenge for 150 bonus points.`;
    } else if (userMessage.includes('energy') || userMessage.includes('save')) {
      response = `Energy conservation is crucial! Simple actions like turning off lights, using stairs instead of elevators, and unplugging electronics can save significant energy. Your energy-saving activities are contributing to a more sustainable campus.`;
    } else if (userMessage.includes('challenge') || userMessage.includes('difficult')) {
      response = `I'd recommend the "Carbon Footprint Detective" challenge - it's medium difficulty (100 points) and really helps you understand your environmental impact. Or try "Zero Waste Week" if you want a bigger challenge (150 points)!`;
    } else {
      response = `That's a great question! As your AI eco-advisor, I'm here to help you make the most of your sustainability journey. You currently have ${userProfile.points} points - that's amazing progress! What specific eco-activity would you like to learn more about?`;
    }

    return {
      message: response,
      timestamp: new Date().toISOString()
    };
  }
}
