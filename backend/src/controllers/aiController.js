import { AIService } from '../services/aiService.js';
import { GeminiService } from '../services/geminiService.js';
import { DemoAIService } from '../services/demoAIService.js';
import User from '../models/user.js';
import Activity from '../models/Activity.js';
import OpenAI from 'openai';

// AI Chatbot endpoint
export const getEcoAdvice = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const advice = await DemoAIService.getEcoAdvice(user, req.body.location || 'campus');
    res.json(advice);
  } catch (error) {
    console.error('Eco Advice Error:', error);
    res.status(500).json({ message: 'Failed to get eco advice' });
  }
};

// Get AI-powered activity suggestions
export const getActivitySuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const suggestions = await DemoAIService.getActivitySuggestions(user, req.body.weather || 'sunny');
    res.json(suggestions);
  } catch (error) {
    console.error('Activity Suggestions Error:', error);
    res.status(500).json({ message: 'Failed to get activity suggestions' });
  }
};

// AI-powered activity verification
export const verifyActivity = async (req, res) => {
  try {
    const { description, imageBase64 } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Activity description is required' });
    }

    const verification = await DemoAIService.verifyActivity(description, imageBase64);
    res.json(verification);
  } catch (error) {
    console.error('Activity Verification Error:', error);
    res.status(500).json({ message: 'Failed to verify activity' });
  }
};

// Generate dynamic eco-challenges
export const generateChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const challenges = await DemoAIService.generateChallenges(user, req.body.campusData || {});
    res.json(challenges);
  } catch (error) {
    console.error('Challenges Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate challenges' });
  }
};

// Calculate carbon impact
export const calculateCarbonImpact = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's activities
    const activities = await Activity.find({ user: user._id });
    
    const impact = await DemoAIService.calculateCarbonImpact(activities);
    res.json(impact);
  } catch (error) {
    console.error('Carbon Impact Error:', error);
    res.status(500).json({ message: 'Failed to calculate carbon impact' });
  }
};

// AI Chat endpoint for conversational interface
export const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response = await DemoAIService.chatWithAI(message, user, context || 'general eco-advice');
    res.json(response);
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: 'Failed to process chat message' });
  }
};
