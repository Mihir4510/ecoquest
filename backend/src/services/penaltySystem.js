// Enhanced Eco-Points Reduction System
export class PenaltySystem {
  
  // Calculate inactivity penalty
  static calculateInactivityPenalty(user) {
    const lastActivityDate = user.lastActivityDate;
    if (!lastActivityDate) return 0;

    const daysSinceLastActivity = Math.floor((new Date() - new Date(lastActivityDate)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActivity >= 7) {
      const weeksInactive = Math.floor(daysSinceLastActivity / 7);
      const basePenalty = 10; // -10 points per inactive week
      
      // Tier-based penalty (higher levels lose more points)
      const tierMultiplier = this.getTierMultiplier(user.level);
      
      return Math.min(weeksInactive * basePenalty * tierMultiplier, 100); // Cap at 100 points
    }
    
    return 0;
  }

  // Detect and calculate unsustainable activity penalties
  static calculateUnsustainablePenalty(activityType, user) {
    const penalties = {
      'plastic_bottle_usage': 15,
      'excessive_electricity': 20,
      'not_recycling': 25,
      'wasteful_water_usage': 18,
      'single_use_plastic': 15,
      'skipping_waste_segregation': 20,
      'energy_waste': 12,
      'carbon_heavy_transport': 30
    };

    const basePenalty = penalties[activityType] || 10;
    const tierMultiplier = this.getTierMultiplier(user.level);
    
    return basePenalty * tierMultiplier;
  }

  // AI-detected behavior trend penalties
  static calculateBehaviorTrendPenalty(user, activities) {
    let penalty = 0;
    
    // Check for declining eco activity
    const recentActivities = activities.slice(-10); // Last 10 activities
    const olderActivities = activities.slice(-20, -10); // Previous 10 activities
    
    if (recentActivities.length >= 5 && olderActivities.length >= 5) {
      const recentAvg = recentActivities.reduce((sum, act) => sum + act.points, 0) / recentActivities.length;
      const olderAvg = olderActivities.reduce((sum, act) => sum + act.points, 0) / olderActivities.length;
      
      if (recentAvg < olderAvg * 0.5) { // 50% decline
        penalty += 25;
      }
    }

    // Check for increased plastic submissions (negative trend)
    const plasticSubmissions = activities.filter(act => act.type === 'Plastic Submission');
    if (plasticSubmissions.length > 5) { // Too many plastic submissions
      penalty += plasticSubmissions.length * 5; // 5 points per excessive submission
    }

    return Math.min(penalty, 50); // Cap at 50 points
  }

  // Streak break penalty
  static calculateStreakBreakPenalty(user) {
    if (!user.streakCount || user.streakCount === 0) return 0;
    
    const daysSinceLastActivity = Math.floor((new Date() - new Date(user.lastActivityDate)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActivity > 1) { // Streak broken
      const streakLength = user.streakCount;
      let penalty = 0;
      
      if (streakLength >= 3) penalty = 5; // -5 points for 3+ day streak break
      if (streakLength >= 7) penalty = 10; // -10 points for weekly streak break
      if (streakLength >= 30) penalty = 25; // -25 points for monthly streak break
      
      return penalty;
    }
    
    return 0;
  }

  // Challenge failure penalty
  static calculateChallengeFailurePenalty(challenge, user) {
    const challengePoints = challenge.points || 50;
    const failurePenalty = Math.floor(challengePoints * 0.3); // 30% of challenge points
    
    const tierMultiplier = this.getTierMultiplier(user.level);
    
    return Math.floor(failurePenalty * tierMultiplier);
  }

  // Get tier-based multiplier for penalties
  static getTierMultiplier(userLevel) {
    if (userLevel <= 3) return 0.5; // New users get smaller deductions
    if (userLevel <= 6) return 1.0; // Medium level users
    return 1.5; // Higher level users (Eco Guardian+) have greater responsibility
  }

  // Calculate eco health score and zone
  static calculateEcoHealth(user, activities, penalties = []) {
    let healthScore = 100; // Start with perfect health
    
    // Deduct for recent penalties
    const recentPenalties = penalties.filter(p => {
      const daysSince = Math.floor((new Date() - new Date(p.date)) / (1000 * 60 * 60 * 24));
      return daysSince <= 30; // Only consider penalties from last 30 days
    });
    
    healthScore -= recentPenalties.reduce((sum, p) => sum + p.points, 0) * 0.5; // Each penalty point reduces health by 0.5
    
    // Deduct for inactivity
    const inactivityPenalty = this.calculateInactivityPenalty(user);
    healthScore -= inactivityPenalty * 0.3;
    
    // Deduct for streak breaks
    const streakPenalty = this.calculateStreakBreakPenalty(user);
    healthScore -= streakPenalty * 0.4;
    
    // Bonus for consistent positive activities
    const recentPositiveActivities = activities.filter(act => {
      const daysSince = Math.floor((new Date() - new Date(act.createdAt)) / (1000 * 60 * 60 * 24));
      return daysSince <= 7 && act.points > 0;
    });
    
    if (recentPositiveActivities.length >= 3) {
      healthScore += 10; // Bonus for consistent activity
    }
    
    // Ensure health score is between 0 and 100
    healthScore = Math.max(0, Math.min(100, healthScore));
    
    // Determine zone
    let zone, color, icon, message;
    if (healthScore >= 80) {
      zone = 'green';
      color = 'green';
      icon = '🌱';
      message = 'Excellent eco performance! Keep up the great work!';
    } else if (healthScore >= 60) {
      zone = 'yellow';
      color = 'yellow';
      icon = '⚠️';
      message = 'Good progress, but room for improvement. Stay consistent!';
    } else {
      zone = 'red';
      color = 'red';
      icon = '🔴';
      message = 'Eco health needs attention. Focus on positive activities!';
    }
    
    return {
      score: Math.round(healthScore),
      zone,
      color,
      icon,
      message,
      details: {
        baseScore: 100,
        penaltyDeduction: recentPenalties.reduce((sum, p) => sum + p.points, 0) * 0.5,
        inactivityDeduction: inactivityPenalty * 0.3,
        streakDeduction: streakPenalty * 0.4,
        activityBonus: recentPositiveActivities.length >= 3 ? 10 : 0
      }
    };
  }

  // Generate penalty log entry
  static createPenaltyLogEntry(type, points, reason, userLevel) {
    const tierMultiplier = this.getTierMultiplier(userLevel);
    const finalPoints = Math.floor(points * tierMultiplier);
    
    const messages = {
      'inactivity': `Lost ${finalPoints} points for ${Math.floor(points/10)} week(s) of inactivity`,
      'unsustainable': `Lost ${finalPoints} points for unsustainable activity: ${reason}`,
      'behavior_trend': `Lost ${finalPoints} points due to declining eco activity patterns`,
      'streak_break': `Lost ${finalPoints} points for breaking ${Math.floor(points/5)} day eco streak`,
      'challenge_failure': `Lost ${finalPoints} points for failing to complete eco challenge`,
      'ai_detected': `Lost ${finalPoints} points due to AI-detected negative behavior patterns`
    };
    
    return {
      type,
      points: finalPoints,
      reason: messages[type] || reason,
      date: new Date(),
      tierMultiplier,
      originalPoints: points
    };
  }

  // Generate recovery challenges
  static generateRecoveryChallenges(user, penaltyAmount) {
    const challenges = [
      {
        title: "Eco Recovery Sprint",
        description: "Complete 3 eco activities in the next 2 days to recover lost points",
        duration: "2 days",
        points: Math.floor(penaltyAmount * 0.8), // Recover 80% of lost points
        difficulty: "medium",
        category: "recovery",
        requirements: "Complete 3 positive eco activities"
      },
      {
        title: "Consistency Comeback",
        description: "Maintain a 5-day eco streak to prove your commitment",
        duration: "5 days",
        points: Math.floor(penaltyAmount * 1.2), // Bonus recovery
        difficulty: "medium",
        category: "recovery",
        requirements: "Log eco activity for 5 consecutive days"
      },
      {
        title: "Impact Amplifier",
        description: "Complete one high-impact activity (50+ points) to show dedication",
        duration: "1 day",
        points: Math.floor(penaltyAmount * 0.6), // Partial recovery
        difficulty: "hard",
        category: "recovery",
        requirements: "Complete activity worth 50+ points"
      }
    ];
    
    return challenges;
  }

  // Check if user qualifies for recovery bonus
  static checkRecoveryBonus(user, activities) {
    const recentActivities = activities.filter(act => {
      const daysSince = Math.floor((new Date() - new Date(act.createdAt)) / (1000 * 60 * 60 * 24));
      return daysSince <= 7 && act.points > 0;
    });
    
    if (recentActivities.length >= 5) {
      return {
        eligible: true,
        bonusPoints: 25,
        reason: "Excellent recovery! 5+ positive activities in 7 days"
      };
    }
    
    return { eligible: false };
  }
}

