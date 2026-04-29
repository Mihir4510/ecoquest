import { PenaltySystem } from '../services/penaltySystem.js';
import User from '../models/user.js';
import Activity from '../models/Activity.js';

// Apply inactivity penalty to a user
export const applyInactivityPenalty = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const penalty = PenaltySystem.calculateInactivityPenalty(user);
    
    if (penalty > 0) {
      // Create penalty log entry
      const penaltyEntry = PenaltySystem.createPenaltyLogEntry(
        'inactivity',
        penalty,
        `Inactive for ${Math.floor((new Date() - new Date(user.lastActivityDate)) / (1000 * 60 * 60 * 24 * 7))} week(s)`,
        user.level
      );

      // Update user
      user.points = Math.max(0, user.points - penalty);
      user.penaltyLog.push(penaltyEntry);
      await user.save();

      res.json({
        success: true,
        penalty,
        newPoints: user.points,
        reason: penaltyEntry.reason,
        recoveryChallenges: PenaltySystem.generateRecoveryChallenges(user, penalty)
      });
    } else {
      res.json({
        success: false,
        message: 'No inactivity penalty applicable',
        penalty: 0
      });
    }
  } catch (error) {
    console.error('Inactivity Penalty Error:', error);
    res.status(500).json({ message: 'Failed to apply inactivity penalty' });
  }
};

// Report unsustainable activity
export const reportUnsustainableActivity = async (req, res) => {
  try {
    const { activityType, description } = req.body;
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const penalty = PenaltySystem.calculateUnsustainablePenalty(activityType, user);
    
    if (penalty > 0) {
      // Create penalty log entry
      const penaltyEntry = PenaltySystem.createPenaltyLogEntry(
        'unsustainable',
        penalty,
        description || activityType,
        user.level
      );

      // Update user
      user.points = Math.max(0, user.points - penalty);
      user.penaltyLog.push(penaltyEntry);
      await user.save();

      res.json({
        success: true,
        penalty,
        newPoints: user.points,
        reason: penaltyEntry.reason,
        recoveryChallenges: PenaltySystem.generateRecoveryChallenges(user, penalty)
      });
    } else {
      res.json({
        success: false,
        message: 'Invalid activity type',
        penalty: 0
      });
    }
  } catch (error) {
    console.error('Unsustainable Activity Error:', error);
    res.status(500).json({ message: 'Failed to report unsustainable activity' });
  }
};

// Apply AI-detected behavior penalties
export const applyBehaviorPenalty = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user activities for analysis
    const activities = await Activity.find({ user: userId }).sort({ createdAt: -1 });
    
    const penalty = PenaltySystem.calculateBehaviorTrendPenalty(user, activities);
    
    if (penalty > 0) {
      // Create penalty log entry
      const penaltyEntry = PenaltySystem.createPenaltyLogEntry(
        'behavior_trend',
        penalty,
        'AI-detected declining eco activity patterns',
        user.level
      );

      // Update user
      user.points = Math.max(0, user.points - penalty);
      user.penaltyLog.push(penaltyEntry);
      await user.save();

      res.json({
        success: true,
        penalty,
        newPoints: user.points,
        reason: penaltyEntry.reason,
        recoveryChallenges: PenaltySystem.generateRecoveryChallenges(user, penalty)
      });
    } else {
      res.json({
        success: false,
        message: 'No behavior penalties detected',
        penalty: 0
      });
    }
  } catch (error) {
    console.error('Behavior Penalty Error:', error);
    res.status(500).json({ message: 'Failed to apply behavior penalty' });
  }
};

// Apply streak break penalty
export const applyStreakBreakPenalty = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const penalty = PenaltySystem.calculateStreakBreakPenalty(user);
    
    if (penalty > 0) {
      // Create penalty log entry
      const penaltyEntry = PenaltySystem.createPenaltyLogEntry(
        'streak_break',
        penalty,
        `Broke ${user.streakCount} day eco streak`,
        user.level
      );

      // Update user
      user.points = Math.max(0, user.points - penalty);
      user.streakCount = 0; // Reset streak
      user.penaltyLog.push(penaltyEntry);
      await user.save();

      res.json({
        success: true,
        penalty,
        newPoints: user.points,
        reason: penaltyEntry.reason,
        recoveryChallenges: PenaltySystem.generateRecoveryChallenges(user, penalty)
      });
    } else {
      res.json({
        success: false,
        message: 'No streak break penalty applicable',
        penalty: 0
      });
    }
  } catch (error) {
    console.error('Streak Break Penalty Error:', error);
    res.status(500).json({ message: 'Failed to apply streak break penalty' });
  }
};

// Apply challenge failure penalty
export const applyChallengeFailurePenalty = async (req, res) => {
  try {
    const { challengeId, challenge } = req.body;
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const penalty = PenaltySystem.calculateChallengeFailurePenalty(challenge, user);
    
    if (penalty > 0) {
      // Create penalty log entry
      const penaltyEntry = PenaltySystem.createPenaltyLogEntry(
        'challenge_failure',
        penalty,
        `Failed to complete challenge: ${challenge.title}`,
        user.level
      );

      // Update user
      user.points = Math.max(0, user.points - penalty);
      user.penaltyLog.push(penaltyEntry);
      await user.save();

      res.json({
        success: true,
        penalty,
        newPoints: user.points,
        reason: penaltyEntry.reason,
        recoveryChallenges: PenaltySystem.generateRecoveryChallenges(user, penalty)
      });
    } else {
      res.json({
        success: false,
        message: 'Invalid challenge or no penalty applicable',
        penalty: 0
      });
    }
  } catch (error) {
    console.error('Challenge Failure Penalty Error:', error);
    res.status(500).json({ message: 'Failed to apply challenge failure penalty' });
  }
};

// Get penalty log for user
export const getPenaltyLog = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId).select('penaltyLog ecoHealth');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      penaltyLog: user.penaltyLog,
      ecoHealth: user.ecoHealth,
      summary: {
        totalPenalties: user.penaltyLog.length,
        totalPointsLost: user.penaltyLog.reduce((sum, p) => sum + p.points, 0),
        unrecoveredPenalties: user.penaltyLog.filter(p => !p.recovered).length
      }
    });
  } catch (error) {
    console.error('Get Penalty Log Error:', error);
    res.status(500).json({ message: 'Failed to get penalty log' });
  }
};

// Calculate and update eco health
export const calculateEcoHealth = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user activities
    const activities = await Activity.find({ user: userId }).sort({ createdAt: -1 });
    
    // Calculate eco health
    const ecoHealth = PenaltySystem.calculateEcoHealth(user, activities, user.penaltyLog);
    
    // Update user's eco health
    user.ecoHealth = {
      score: ecoHealth.score,
      zone: ecoHealth.zone,
      lastCalculated: new Date()
    };
    await user.save();

    res.json({
      success: true,
      ecoHealth,
      recoveryBonus: PenaltySystem.checkRecoveryBonus(user, activities)
    });
  } catch (error) {
    console.error('Eco Health Calculation Error:', error);
    res.status(500).json({ message: 'Failed to calculate eco health' });
  }
};

// Complete recovery challenge
export const completeRecoveryChallenge = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find recovery challenge
    const challenge = user.recoveryChallenges.find(c => c.challengeId === challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Recovery challenge not found' });
    }

    if (challenge.completed) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    // Mark challenge as completed and award points
    challenge.completed = true;
    challenge.completedAt = new Date();
    user.points += challenge.points;

    await user.save();

    res.json({
      success: true,
      pointsAwarded: challenge.points,
      newPoints: user.points,
      message: `Recovery challenge completed! +${challenge.points} points earned.`
    });
  } catch (error) {
    console.error('Recovery Challenge Error:', error);
    res.status(500).json({ message: 'Failed to complete recovery challenge' });
  }
};

// Get all penalties for admin dashboard
export const getAllPenalties = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name email points penaltyLog ecoHealth level')
      .sort({ 'penaltyLog.date': -1 });

    const penaltySummary = users.map(user => ({
      userId: user._id,
      name: user.name,
      email: user.email,
      currentPoints: user.points,
      level: user.level,
      ecoHealth: user.ecoHealth,
      recentPenalties: user.penaltyLog.slice(0, 5), // Last 5 penalties
      totalPenalties: user.penaltyLog.length,
      totalPointsLost: user.penaltyLog.reduce((sum, p) => sum + p.points, 0)
    }));

    res.json({
      success: true,
      penaltySummary,
      stats: {
        totalUsers: users.length,
        usersWithPenalties: users.filter(u => u.penaltyLog.length > 0).length,
        totalPenaltyPoints: users.reduce((sum, u) => 
          sum + u.penaltyLog.reduce((pSum, p) => pSum + p.points, 0), 0
        )
      }
    });
  } catch (error) {
    console.error('Get All Penalties Error:', error);
    res.status(500).json({ message: 'Failed to get penalty summary' });
  }
};

