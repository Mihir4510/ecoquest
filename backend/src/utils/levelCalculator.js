// Level calculation based on total points

export const calculateLevel = (points) => {
  if (points >= 600) {
    return {
      level: 4,
      levelName: "🌎 Eco Guardian",
      levelMessage: "You're an environmental hero!",
      icon: "🌎"
    };
  } else if (points >= 300) {
    return {
      level: 3,
      levelName: "🌳 Forest Keeper",
      levelMessage: "You're protecting nature!",
      icon: "🌳"
    };
  } else if (points >= 100) {
    return {
      level: 2,
      levelName: "🌿 Small Plant",
      levelMessage: "Keep growing strong!",
      icon: "🌿"
    };
  } else {
    return {
      level: 1,
      levelName: "🌱 Seed",
      levelMessage: "You started your green journey!",
      icon: "🌱"
    };
  }
};

// Check if user leveled up
export const checkLevelUp = (oldPoints, newPoints) => {
  const oldLevel = calculateLevel(oldPoints);
  const newLevel = calculateLevel(newPoints);
  
  if (newLevel.level > oldLevel.level) {
    return {
      leveledUp: true,
      newLevel: newLevel
    };
  }
  
  return {
    leveledUp: false,
    newLevel: newLevel
  };
};

// Calculate streak based on activity dates
export const calculateStreak = (lastActivityDate, currentDate = new Date()) => {
  if (!lastActivityDate) {
    return {
      streakCount: 1,
      streakBroken: false,
      message: "🎉 Streak started! Keep it going!"
    };
  }

  const lastDate = new Date(lastActivityDate);
  const today = new Date(currentDate);
  
  // Reset time to midnight for accurate day comparison
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - no streak change
    return {
      streakCount: null, // Keep current streak
      streakBroken: false,
      message: "Activity logged for today!"
    };
  } else if (diffDays === 1) {
    // Next day - increment streak
    return {
      streakCount: "increment", // Signal to increment
      streakBroken: false,
      message: "🔥 Streak continued!"
    };
  } else {
    // Streak broken
    return {
      streakCount: 1, // Reset to 1
      streakBroken: true,
      message: "Streak reset. Start fresh today!"
    };
  }
};

