import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI only if API key is available and valid
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.log('⚠️ OpenAI API key not configured. AI features will use fallback responses.');
}

// AI Eco-Chatbot Service
export class AIService {
  
  // Get personalized eco-advice based on user profile
  static async getEcoAdvice(userProfile, userLocation = 'campus') {
    try {
      if (!openai) {
        throw new Error('OpenAI not configured');
      }

      const prompt = `
        You are an AI Eco-Advisor for college students. Provide personalized eco-friendly advice based on:
        
        User Profile:
        - Points: ${userProfile.points || 0}
        - Activities Completed: ${userProfile.stats?.activitiesCompleted || 0}
        - Trees Planted: ${userProfile.stats?.treesPlanted || 0}
        - Location: ${userLocation}
        
        Provide 3 specific, actionable eco-tips that are:
        1. Relevant to college students
        2. Easy to implement on campus
        3. Motivating and engaging
        4. Include point values for motivation
        
        Format as JSON with: {"tips": [{"title": "", "description": "", "points": 0, "difficulty": "easy/medium/hard"}]}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        tips: [
          {
            title: "Use a Reusable Water Bottle",
            description: "Replace single-use plastic bottles with a reusable one",
            points: 10,
            difficulty: "easy"
          },
          {
            title: "Take the Stairs",
            description: "Skip the elevator and take stairs to save energy",
            points: 5,
            difficulty: "easy"
          },
          {
            title: "Plant a Tree",
            description: "Plant a tree on campus or in your community",
            points: 50,
            difficulty: "medium"
          }
        ]
      };
    }
  }

  // Generate personalized activity suggestions
  static async getActivitySuggestions(userProfile, weather = 'sunny') {
    try {
      if (!openai) {
        throw new Error('OpenAI not configured');
      }

      const prompt = `
        Generate 5 eco-friendly activity suggestions for a college student based on:
        - Current weather: ${weather}
        - User level: ${userProfile.points < 100 ? 'beginner' : userProfile.points < 500 ? 'intermediate' : 'expert'}
        - Campus environment
        - Time of day: ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
        
        Include indoor and outdoor options. Format as JSON:
        {"suggestions": [{"title": "", "description": "", "points": 0, "weather": "", "time": "", "location": ""}]}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 600
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Suggestions Error:', error);
      return {
        suggestions: [
          {
            title: "Campus Cleanup",
            description: "Pick up litter around campus",
            points: 25,
            weather: "any",
            time: "any",
            location: "campus"
          },
          {
            title: "Energy Audit",
            description: "Check and turn off unused electronics",
            points: 15,
            weather: "any",
            time: "any",
            location: "dorm/room"
          }
        ]
      };
    }
  }

  // AI-powered activity verification
  static async verifyActivity(activityDescription, imageBase64 = null) {
    try {
      if (!openai) {
        throw new Error('OpenAI not configured');
      }

      let prompt = `
        Verify if this eco-activity description is legitimate and calculate appropriate points:
        Activity: "${activityDescription}"
        
        Consider:
        - Is this a real eco-friendly activity?
        - Is the description detailed enough?
        - What points should be awarded (5-100 range)?
        - Any red flags for fake submissions?
        
        Respond with JSON:
        {"verified": true/false, "points": 0, "confidence": 0.0-1.0, "reason": ""}
      `;

      if (imageBase64) {
        prompt += `\n\nImage analysis: Analyze the uploaded image to verify the activity.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Verification Error:', error);
      return {
        verified: true,
        points: 10,
        confidence: 0.5,
        reason: "Default verification due to AI service error"
      };
    }
  }

  // Generate dynamic eco-challenges
  static async generateChallenges(userProfile, campusData = {}) {
    try {
      if (!openai) {
        throw new Error('OpenAI not configured');
      }

      const prompt = `
        Generate 3 unique eco-challenges for college students based on:
        - User level: ${userProfile.points < 100 ? 'beginner' : 'advanced'}
        - Season: ${new Date().getMonth() < 3 ? 'winter' : new Date().getMonth() < 6 ? 'spring' : new Date().getMonth() < 9 ? 'summer' : 'fall'}
        - Campus type: university
        - Duration: 1-7 days
        
        Make them creative, achievable, and fun! Format as JSON:
        {"challenges": [{"title": "", "description": "", "duration": "", "points": 0, "difficulty": "", "category": ""}]}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Challenges Error:', error);
      return {
        challenges: [
          {
            title: "Zero Waste Week",
            description: "Go 7 days without producing any non-recyclable waste",
            duration: "7 days",
            points: 100,
            difficulty: "hard",
            category: "waste reduction"
          },
          {
            title: "Bike to Class",
            description: "Use only bicycle or walking for transportation",
            duration: "3 days",
            points: 50,
            difficulty: "medium",
            category: "transportation"
          }
        ]
      };
    }
  }

  // Calculate carbon footprint impact
  static async calculateCarbonImpact(activities) {
    try {
      if (!openai) {
        throw new Error('OpenAI not configured');
      }

      const prompt = `
        Calculate the carbon footprint impact of these eco-activities:
        ${JSON.stringify(activities)}
        
        Provide:
        - CO2 saved in kg
        - Trees equivalent
        - Water saved in liters
        - Energy saved in kWh
        
        Format as JSON:
        {"co2Saved": 0, "treesEquivalent": 0, "waterSaved": 0, "energySaved": 0, "impact": ""}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 300
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Carbon Calculation Error:', error);
      return {
        co2Saved: 0,
        treesEquivalent: 0,
        waterSaved: 0,
        energySaved: 0,
        impact: "Unable to calculate impact"
      };
    }
  }
}
