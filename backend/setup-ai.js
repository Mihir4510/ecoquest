import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load existing .env if it exists
dotenv.config();

async function setupAI() {
  console.log('🚀 Setting up AI Integration for College Eco-Tracker');
  console.log('=' .repeat(60));

  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  const envExists = fs.existsSync(envPath);

  if (!envExists) {
    console.log('\n📝 Creating .env file...');
    const defaultEnv = `# Database
MONGODB_URI=mongodb://localhost:27017/eco-tracker

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_${Math.random().toString(36).substring(7)}

# Server
PORT=5000
NODE_ENV=development

# Google Gemini Configuration (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Cloud Vision (Optional - for image analysis)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ .env file created');
  } else {
    console.log('✅ .env file already exists');
  }

  // Check dependencies
  console.log('\n📦 Checking dependencies...');
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = ['@google/generative-ai', '@google-cloud/vision'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log('⚠️ Missing dependencies:', missingDeps.join(', '));
    console.log('Run: npm install', missingDeps.join(' '));
  } else {
    console.log('✅ All required dependencies are installed');
  }

  // Check environment variables
  console.log('\n🔧 Environment Configuration:');
  console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing');
  console.log('Google Vision:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Configured' : '⚠️ Not configured (using mock)');
  console.log('MongoDB URI:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing');
  console.log('JWT Secret:', process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing');

  // Provide setup instructions
  console.log('\n📋 Setup Instructions:');
  console.log('=' .repeat(40));
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log('\n🤖 Google Gemini Setup:');
    console.log('1. Visit: https://makersuite.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Copy the key and add it to your .env file:');
    console.log('   GEMINI_API_KEY=your_actual_key_here');
  }

  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
    console.log('\n🗄️ MongoDB Setup:');
    console.log('1. Install MongoDB: https://docs.mongodb.com/manual/installation/');
    console.log('2. Start MongoDB service');
    console.log('3. Update MONGODB_URI in .env if using different connection string');
  }

  console.log('\n🧪 Testing Setup:');
  console.log('Run: node test-ai.js');
  
  console.log('\n🚀 Starting Server:');
  console.log('Run: npm run dev');

  console.log('\n✅ AI Setup Complete!');
  console.log('📖 For detailed instructions, see: AI_INTEGRATION_GUIDE.md');
}

setupAI().catch(console.error);
