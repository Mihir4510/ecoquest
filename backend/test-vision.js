import { verifyPlasticImage } from "./src/services/plasticVerificationService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Testing Google Vision API Integration for Plastic Detection");
console.log("============================================================");

// Check if we have test images
const uploadsDir = path.join(__dirname, "uploads");
const testImages = fs.readdirSync(uploadsDir).filter(file => 
  file.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)
);

if (testImages.length === 0) {
  console.log("❌ No test images found in uploads directory");
  console.log("Please upload some plastic images to test the Vision API");
  process.exit(1);
}

console.log(`📸 Found ${testImages.length} test images:`);
testImages.forEach((img, index) => {
  console.log(`   ${index + 1}. ${img}`);
});

// Test with the first image
const testImagePath = path.join(uploadsDir, testImages[0]);
console.log(`\n🧪 Testing with: ${testImages[0]}`);
console.log("⏳ Analyzing image...\n");

try {
  const startTime = Date.now();
  const result = await verifyPlasticImage(testImagePath);
  const endTime = Date.now();
  
  console.log("✅ Analysis Complete!");
  console.log(`⏱️  Processing time: ${endTime - startTime}ms`);
  console.log("\n📊 Results:");
  console.log(`   Verified: ${result.verified ? '✅ Yes' : '❌ No'}`);
  console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  console.log(`   Plastic Type: ${result.plasticType}`);
  console.log(`   Estimated Quantity: ${result.estimatedQuantity}`);
  console.log(`   Estimated Weight: ${result.estimatedWeight} kg`);
  
  if (result.detectedItems && result.detectedItems.length > 0) {
    console.log("\n🔍 Detected Items:");
    result.detectedItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} (${(item.confidence * 100).toFixed(1)}%)`);
    });
  }
  
  if (result.message) {
    console.log(`\n💬 Message: ${result.message}`);
  }
  
  // Test points calculation
  const { calculatePoints } = await import("./src/services/plasticVerificationService.js");
  const points = calculatePoints(result.estimatedQuantity, result.estimatedWeight);
  console.log(`\n🏆 Points Earned: ${points}`);
  
  console.log("\n🎉 Test completed successfully!");
  
} catch (error) {
  console.error("❌ Error during testing:", error.message);
  console.error("\n🔧 Troubleshooting tips:");
  console.error("1. Make sure GOOGLE_APPLICATION_CREDENTIALS is set in your .env file");
  console.error("2. Verify your service account has Vision API access");
  console.error("3. Check that the Vision API is enabled in your Google Cloud project");
  console.error("4. Ensure the image file exists and is readable");
}

// Test with multiple images if available
if (testImages.length > 1) {
  console.log(`\n🔄 Testing with additional images...`);
  
  for (let i = 1; i < Math.min(testImages.length, 3); i++) {
    const imagePath = path.join(uploadsDir, testImages[i]);
    console.log(`\n📸 Testing: ${testImages[i]}`);
    
    try {
      const result = await verifyPlasticImage(imagePath);
      console.log(`   Result: ${result.verified ? '✅ Verified' : '❌ Not verified'} (${(result.confidence * 100).toFixed(1)}%)`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
}

console.log("\n✨ Google Vision API test completed!");
