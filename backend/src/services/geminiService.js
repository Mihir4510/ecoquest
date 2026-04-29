import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  }
});

// Gemini AI Service
export class GeminiService {
  
  // Get personalized eco-advice using Gemini
  static async getEcoAdvice(userProfile, userLocation = 'campus') {
    try {
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Gemini Eco Advice Error:', error);
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

  // AI-powered activity verification using Gemini
  static async verifyActivity(activityDescription, imageBase64 = null) {
    try {
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Gemini Verification Error:', error);
      return {
        verified: true,
        points: 10,
        confidence: 0.5,
        reason: "Default verification due to AI service error"
      };
    }
  }

  // Generate personalized activity suggestions using Gemini
  static async getActivitySuggestions(userProfile, weather = 'sunny') {
    try {
      const prompt = `
        Generate 5 eco-friendly activity suggestions for a college student based on:
        - Current weather: ${weather}
        - User level: ${userProfile.points < 100 ? 'beginner' : userProfile.points < 500 ? 'intermediate' : 'expert'}
        - Campus environment
        - Time of day: ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
        
        Include indoor and outdoor options. Format as JSON:
        {"suggestions": [{"title": "", "description": "", "points": 0, "weather": "", "time": "", "location": ""}]}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Gemini Suggestions Error:', error);
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

  // Generate dynamic eco-challenges using Gemini
  static async generateChallenges(userProfile, campusData = {}) {
    try {
      const prompt = `
        Generate 3 unique eco-challenges for college students based on:
        - User level: ${userProfile.points < 100 ? 'beginner' : 'advanced'}
        - Season: ${new Date().getMonth() < 3 ? 'winter' : new Date().getMonth() < 6 ? 'spring' : new Date().getMonth() < 9 ? 'summer' : 'fall'}
        - Campus type: university
        - Duration: 1-7 days
        
        Make them creative, achievable, and fun! Format as JSON:
        {"challenges": [{"title": "", "description": "", "duration": "", "points": 0, "difficulty": "", "category": ""}]}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Gemini Challenges Error:', error);
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

  // Calculate carbon footprint impact using Gemini
  static async calculateCarbonImpact(activities) {
    try {
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Gemini Carbon Calculation Error:', error);
      return {
        co2Saved: 0,
        treesEquivalent: 0,
        waterSaved: 0,
        energySaved: 0,
        impact: "Unable to calculate impact"
      };
    }
  }

  // AI Chat using Gemini
  static async chatWithAI(message, userProfile, context = 'general eco-advice') {
    try {
      const prompt = `
        You are an AI Eco-Advisor for college students. 
        User Profile: ${userProfile.name}, Points: ${userProfile.points}, Activities: ${userProfile.stats?.activitiesCompleted || 0}
        
        Context: ${context}
        User Message: "${message}"
        
        Respond as a friendly, knowledgeable eco-advisor. Keep responses under 200 words.
        Include specific, actionable advice and mention point values when relevant.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        message: text,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      return {
        message: "I'm having trouble connecting right now. Please try again later or contact support.",
        timestamp: new Date().toISOString()
      };
    }
  }
}
