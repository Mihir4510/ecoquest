import { PenaltySystem } from './src/services/penaltySystem.js';

async function testPenaltySystem() {
  console.log('⚖️ Testing Enhanced Eco-Points Penalty System\n');
  console.log('=' .repeat(60));

  // Mock user data
  const mockUser = {
    name: 'Test User',
    level: 5, // Forest level
    points: 750,
    streakCount: 7,
    lastActivityDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    stats: {
      activitiesCompleted: 15,
      treesPlanted: 3,
      wasteRecycled: 8
    }
  };

  // Mock activities
  const mockActivities = [
    { type: 'Tree Planting', points: 50, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { type: 'Cycling', points: 15, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { type: 'Recycling', points: 20, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { type: 'Plastic Submission', points: 25, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { type: 'Plastic Submission', points: 25, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { type: 'Plastic Submission', points: 25, createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000) }
  ];

  // Mock penalty log
  const mockPenalties = [
    {
      type: 'inactivity',
      points: 15,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      reason: 'Lost 15 points for 1 week of inactivity'
    },
    {
      type: 'unsustainable',
      points: 20,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reason: 'Lost 20 points for excessive plastic usage'
    }
  ];

  try {
    // Test 1: Inactivity Penalty
    console.log('\n1️⃣ Testing Inactivity Penalty...');
    console.log('-'.repeat(40));
    
    const inactivityPenalty = PenaltySystem.calculateInactivityPenalty(mockUser);
    console.log(`📊 User inactive for: ${Math.floor((new Date() - new Date(mockUser.lastActivityDate)) / (1000 * 60 * 60 * 24))} days`);
    console.log(`⚖️ Inactivity penalty: -${inactivityPenalty} points`);
    console.log(`🎯 Tier multiplier: ${PenaltySystem.getTierMultiplier(mockUser.level)}x`);

    // Test 2: Unsustainable Activity Penalty
    console.log('\n2️⃣ Testing Unsustainable Activity Penalties...');
    console.log('-'.repeat(40));
    
    const unsustainableActivities = [
      'plastic_bottle_usage',
      'excessive_electricity', 
      'not_recycling',
      'single_use_plastic'
    ];
    
    unsustainableActivities.forEach(activityType => {
      const penalty = PenaltySystem.calculateUnsustainablePenalty(activityType, mockUser);
      console.log(`🚫 ${activityType}: -${penalty} points`);
    });

    // Test 3: AI Behavior Trend Analysis
    console.log('\n3️⃣ Testing AI Behavior Trend Detection...');
    console.log('-'.repeat(40));
    
    const behaviorPenalty = PenaltySystem.calculateBehaviorTrendPenalty(mockUser, mockActivities);
    console.log(`🤖 AI-detected behavior penalty: -${behaviorPenalty} points`);
    console.log(`📈 Activity analysis: ${mockActivities.length} recent activities`);
    console.log(`🔍 Plastic submissions detected: ${mockActivities.filter(a => a.type === 'Plastic Submission').length}`);

    // Test 4: Streak Break Penalty
    console.log('\n4️⃣ Testing Streak Break Penalty...');
    console.log('-'.repeat(40));
    
    const streakPenalty = PenaltySystem.calculateStreakBreakPenalty(mockUser);
    console.log(`🔥 Current streak: ${mockUser.streakCount} days`);
    console.log(`⚡ Streak break penalty: -${streakPenalty} points`);

    // Test 5: Challenge Failure Penalty
    console.log('\n5️⃣ Testing Challenge Failure Penalty...');
    console.log('-'.repeat(40));
    
    const mockChallenge = {
      title: 'Zero Waste Week',
      points: 100,
      difficulty: 'hard'
    };
    
    const challengePenalty = PenaltySystem.calculateChallengeFailurePenalty(mockChallenge, mockUser);
    console.log(`🎯 Challenge: ${mockChallenge.title} (${mockChallenge.points} points)`);
    console.log(`❌ Failure penalty: -${challengePenalty} points`);

    // Test 6: Eco Health Calculation
    console.log('\n6️⃣ Testing Eco Health Calculation...');
    console.log('-'.repeat(40));
    
    const ecoHealth = PenaltySystem.calculateEcoHealth(mockUser, mockActivities, mockPenalties);
    console.log(`🌱 Eco Health Score: ${ecoHealth.score}/100`);
    console.log(`🎨 Health Zone: ${ecoHealth.zone.toUpperCase()} ${ecoHealth.icon}`);
    console.log(`💬 Message: ${ecoHealth.message}`);
    
    console.log('\n📊 Health Breakdown:');
    console.log(`   Base Score: +${ecoHealth.details.baseScore}`);
    console.log(`   Penalty Deduction: -${ecoHealth.details.penaltyDeduction}`);
    console.log(`   Inactivity Deduction: -${ecoHealth.details.inactivityDeduction}`);
    console.log(`   Streak Deduction: -${ecoHealth.details.streakDeduction}`);
    console.log(`   Activity Bonus: +${ecoHealth.details.activityBonus}`);

    // Test 7: Recovery System
    console.log('\n7️⃣ Testing Recovery Challenge Generation...');
    console.log('-'.repeat(40));
    
    const totalPenalty = inactivityPenalty + behaviorPenalty + streakPenalty;
    const recoveryChallenges = PenaltySystem.generateRecoveryChallenges(mockUser, totalPenalty);
    
    console.log(`🔄 Total penalty to recover: ${totalPenalty} points`);
    console.log(`🎯 Recovery challenges generated: ${recoveryChallenges.length}`);
    
    recoveryChallenges.forEach((challenge, index) => {
      console.log(`\n   ${index + 1}. ${challenge.title}`);
      console.log(`      📝 ${challenge.description}`);
      console.log(`      🎯 Points: +${challenge.points} (${challenge.difficulty})`);
      console.log(`      ⏱️ Duration: ${challenge.duration}`);
    });

    // Test 8: Recovery Bonus Check
    console.log('\n8️⃣ Testing Recovery Bonus Eligibility...');
    console.log('-'.repeat(40));
    
    const recoveryBonus = PenaltySystem.checkRecoveryBonus(mockUser, mockActivities);
    if (recoveryBonus.eligible) {
      console.log(`🎉 Recovery bonus eligible: +${recoveryBonus.bonusPoints} points`);
      console.log(`💡 Reason: ${recoveryBonus.reason}`);
    } else {
      console.log(`❌ Recovery bonus not eligible`);
      console.log(`📊 Recent activities: ${mockActivities.filter(a => {
        const daysSince = Math.floor((new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24));
        return daysSince <= 7 && a.points > 0;
      }).length}`);
    }

    console.log('\n🎉 All Penalty System Tests Completed Successfully!');
    console.log('=' .repeat(60));
    
    console.log('\n📋 System Features Demonstrated:');
    console.log('✅ Inactivity Penalty System');
    console.log('✅ Unsustainable Activity Detection');
    console.log('✅ AI Behavior Trend Analysis');
    console.log('✅ Streak Break Penalties');
    console.log('✅ Challenge Failure Penalties');
    console.log('✅ Eco Health Meter Calculation');
    console.log('✅ Recovery Challenge Generation');
    console.log('✅ Recovery Bonus System');
    console.log('✅ Tier-Based Penalty Multipliers');
    
    console.log('\n🚀 Enhanced penalty system is ready for presentation!');
    console.log('\n💡 Key Benefits:');
    console.log('   • Encourages consistent engagement');
    console.log('   • Maintains system balance and fairness');
    console.log('   • Provides recovery opportunities');
    console.log('   • Uses AI for intelligent behavior analysis');
    console.log('   • Implements tier-based responsibility');

  } catch (error) {
    console.error('\n❌ Penalty System Test Error:', error.message);
  }
}

// Run the test
testPenaltySystem();

