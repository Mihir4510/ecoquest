import dotenv from 'dotenv';
import { GeminiService } from './src/services/geminiService.js';

// Load environment variables
dotenv.config();

async function testGeminiServices() {
  console.log('🤖 Testing Gemini AI Services for College Eco-Tracker\n');
  console.log('=' .repeat(50));

  // Check environment setup
  console.log('\n📋 Environment Check:');
  console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing');

  if (!process.env.GEMINI_API_KEY) {
    console.log('\n❌ Gemini API key not found. Please add GEMINI_API_KEY to your .env file');
    return;
  }

  try {
    // Test 1: Eco Advice
    console.log('\n1️⃣ Testing Gemini Eco Advice...');
    console.log('-'.repeat(30));
    
    const mockUser = {
      name: 'Test User',
      points: 150,
      stats: { 
        activitiesCompleted: 5, 
        treesPlanted: 2,
        wasteRecycled: 3
      }
    };
    
    const advice = await GeminiService.getEcoAdvice(mockUser, 'campus');
    console.log('✅ Gemini Eco Advice Generated:');
    console.log(`   📝 ${advice.tips[0].title}`);
    console.log(`   💡 ${advice.tips[0].description}`);
    console.log(`   🎯 Points: ${advice.tips[0].points}`);

    // Test 2: Activity Verification
    console.log('\n2️⃣ Testing Gemini Activity Verification...');
    console.log('-'.repeat(30));
    
    const verification = await GeminiService.verifyActivity('I planted 3 trees in the campus garden today');
    console.log('✅ Gemini Activity Verification:');
    console.log(`   📋 Verified: ${verification.verified ? '✅ Yes' : '❌ No'}`);
    console.log(`   🎯 Points Awarded: ${verification.points}`);
    console.log(`   🎖️ Confidence: ${(verification.confidence * 100).toFixed(1)}%`);
    console.log(`   💭 Reason: ${verification.reason}`);

    // Test 3: AI Chat
    console.log('\n3️⃣ Testing Gemini AI Chat...');
    console.log('-'.repeat(30));
    
    const chatResponse = await GeminiService.chatWithAI('How can I reduce my carbon footprint?', mockUser);
    console.log('✅ Gemini AI Chat Response:');
    console.log(`   💬 ${chatResponse.message.substring(0, 100)}...`);

    // Test 4: Activity Suggestions
    console.log('\n4️⃣ Testing Gemini Activity Suggestions...');
    console.log('-'.repeat(30));
    
    const suggestions = await GeminiService.getActivitySuggestions(mockUser, 'sunny');
    console.log('✅ Gemini Activity Suggestions:');
    suggestions.suggestions.slice(0, 2).forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion.title}`);
      console.log(`      📝 ${suggestion.description}`);
      console.log(`      🎯 Points: ${suggestion.points}`);
    });

    console.log('\n🎉 All Gemini AI Services Tested Successfully!');
    console.log('=' .repeat(50));
    console.log('\n📊 Test Summary:');
    console.log('✅ Gemini Eco Advice - Working');
    console.log('✅ Gemini Activity Verification - Working');
    console.log('✅ Gemini AI Chat - Working');
    console.log('✅ Gemini Activity Suggestions - Working');
    
    console.log('\n🚀 Your Gemini AI integration is ready for production!');

  } catch (error) {
    console.error('\n❌ Gemini Service Error:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check your Gemini API key is valid');
    console.log('2. Ensure you have sufficient Gemini API quota');
    console.log('3. Check your internet connection');
    console.log('4. Verify the API key has proper permissions');
  }
}

// Run the test
testGeminiServices();
