import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔧 Google Vision API Setup Helper");
console.log("==================================");

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log("📝 Creating .env file from template...");
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env file created!");
  } else {
    // Create basic .env file
    const basicEnvContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/eco-tracker

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Google Cloud Vision API Configuration
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# Gemini AI Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
`;
    fs.writeFileSync(envPath, basicEnvContent);
    console.log("✅ Basic .env file created!");
  }
} else {
  console.log("✅ .env file already exists");
}

// Check for service account key files
const serviceAccountFiles = fs.readdirSync(__dirname).filter(file => 
  file.endsWith('.json') && !file.includes('package')
);

if (serviceAccountFiles.length > 0) {
  console.log("\n🔑 Found potential service account key files:");
  serviceAccountFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  console.log("\n💡 To use Google Vision API:");
  console.log("1. Update GOOGLE_APPLICATION_CREDENTIALS in .env to point to your service account key file");
  console.log("2. Update GOOGLE_CLOUD_PROJECT_ID with your Google Cloud project ID");
  console.log("3. Run 'node test-vision.js' to test the integration");
} else {
  console.log("\n⚠️  No service account key files found");
  console.log("\n📋 To set up Google Vision API:");
  console.log("1. Follow the instructions in GOOGLE_VISION_SETUP.md");
  console.log("2. Download your service account key JSON file");
  console.log("3. Place it in the backend directory");
  console.log("4. Update the .env file with the correct paths");
  console.log("5. Run 'node test-vision.js' to test");
}

// Check if vision package is installed
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const visionInstalled = packageJson.dependencies && packageJson.dependencies['@google-cloud/vision'];
  
  if (visionInstalled) {
    console.log(`\n✅ @google-cloud/vision package installed (v${visionInstalled})`);
  } else {
    console.log("\n❌ @google-cloud/vision package not found");
    console.log("Run: npm install @google-cloud/vision");
  }
} catch (error) {
  console.log("\n❌ Could not read package.json");
}

console.log("\n🚀 Next steps:");
console.log("1. Set up your Google Cloud credentials (see GOOGLE_VISION_SETUP.md)");
console.log("2. Update your .env file with the correct values");
console.log("3. Run 'node test-vision.js' to test the integration");
console.log("4. Start your server with 'npm run dev'");

console.log("\n✨ Setup helper completed!");
