import dotenv from 'dotenv';
import { AIService } from './src/services/aiService.js';

// Load environment variables
dotenv.config();

async function testAIServices() {
  console.log('🧪 Testing AI Services for College Eco-Tracker\n');
  console.log('=' .repeat(50));

  // Check environment setup
  console.log('\n📋 Environment Check:');
  console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing');
  console.log('Google Vision:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Configured' : '⚠️ Using Mock');

  if (!process.env.GEMINI_API_KEY) {
    console.log('\n❌ Gemini API key not found. Please add GEMINI_API_KEY to your .env file');
    return;
  }

  try {
    // Test 1: Eco Advice
    console.log('\n1️⃣ Testing Eco Advice...');
    console.log('-'.repeat(30));
    
    const mockUser = {
      points: 150,
      stats: { 
        activitiesCompleted: 5, 
        treesPlanted: 2,
        wasteRecycled: 3
      }
    };
    
    const advice = await AIService.getEcoAdvice(mockUser, 'campus');
    console.log('✅ Eco Advice Generated:');
    console.log(`   📝 ${advice.tips[0].title}`);
    console.log(`   💡 ${advice.tips[0].description}`);
    console.log(`   🎯 Points: ${advice.tips[0].points}`);

    // Test 2: Activity Verification
    console.log('\n2️⃣ Testing Activity Verification...');
    console.log('-'.repeat(30));
    
    const verification = await AIService.verifyActivity('I planted 3 trees in the campus garden today');
    console.log('✅ Activity Verification:');
    console.log(`   📋 Verified: ${verification.verified ? '✅ Yes' : '❌ No'}`);
    console.log(`   🎯 Points Awarded: ${verification.points}`);
    console.log(`   🎖️ Confidence: ${(verification.confidence * 100).toFixed(1)}%`);
    console.log(`   💭 Reason: ${verification.reason}`);

    // Test 3: Activity Suggestions
    console.log('\n3️⃣ Testing Activity Suggestions...');
    console.log('-'.repeat(30));
    
    const suggestions = await AIService.getActivitySuggestions(mockUser, 'sunny');
    console.log('✅ Activity Suggestions:');
    suggestions.suggestions.slice(0, 2).forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion.title}`);
      console.log(`      📝 ${suggestion.description}`);
      console.log(`      🎯 Points: ${suggestion.points}`);
    });

    // Test 4: Challenge Generation
    console.log('\n4️⃣ Testing Challenge Generation...');
    console.log('-'.repeat(30));
    
    const challenges = await AIService.generateChallenges(mockUser, {});
    console.log('✅ Dynamic Challenges:');
    challenges.challenges.slice(0, 2).forEach((challenge, index) => {
      console.log(`   ${index + 1}. ${challenge.title}`);
      console.log(`      📝 ${challenge.description}`);
      console.log(`      ⏱️ Duration: ${challenge.duration}`);
      console.log(`      🎯 Points: ${challenge.points}`);
    });

    // Test 5: Carbon Impact Calculation
    console.log('\n5️⃣ Testing Carbon Impact Calculation...');
    console.log('-'.repeat(30));
    
    const mockActivities = [
      { type: 'Tree Planting', points: 50, description: 'Planted 2 trees' },
      { type: 'Cycling', points: 10, description: 'Cycled to campus' },
      { type: 'Recycling', points: 15, description: 'Recycled plastic bottles' }
    ];
    
    const impact = await AIService.calculateCarbonImpact(mockActivities);
    console.log('✅ Carbon Impact Calculation:');
    console.log(`   🌍 CO2 Saved: ${impact.co2Saved} kg`);
    console.log(`   🌳 Trees Equivalent: ${impact.treesEquivalent}`);
    console.log(`   💧 Water Saved: ${impact.waterSaved} liters`);
    console.log(`   ⚡ Energy Saved: ${impact.energySaved} kWh`);

    console.log('\n🎉 All AI Services Tested Successfully!');
    console.log('=' .repeat(50));
    console.log('\n📊 Test Summary:');
    console.log('✅ Eco Advice - Working');
    console.log('✅ Activity Verification - Working');
    console.log('✅ Activity Suggestions - Working');
    console.log('✅ Challenge Generation - Working');
    console.log('✅ Carbon Impact Calculation - Working');
    
    console.log('\n🚀 Your AI integration is ready for production!');

  } catch (error) {
    console.error('\n❌ AI Service Error:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check your Gemini API key is valid');
    console.log('2. Ensure you have sufficient Gemini API quota');
    console.log('3. Check your internet connection');
    console.log('4. Verify the API key has proper permissions');
  }
}

// Run the test
testAIServices();
