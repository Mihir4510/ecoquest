import User from '../models/user.js';
import Activity from '../models/Activity.js';

// Get overall campus statistics
export const getCampusStats = async (req, res) => {
  try {
    // Get total users (students)
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Get total activities
    const totalActivities = await Activity.countDocuments();
    
    // Get total points across all users
    const users = await User.find({ role: 'student' });
    const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);
    
    // Calculate trees planted from user stats (more accurate)
    const treesPlanted = users.reduce((sum, user) => sum + (user.stats?.treesPlanted || 0), 0);
    
    // Calculate waste recycled from user stats
    const wasteRecycled = users.reduce((sum, user) => sum + (user.stats?.wasteRecycled || 0), 0);
    
    // Calculate students involved percentage (active users in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      role: 'student',
      updatedAt: { $gte: thirtyDaysAgo }
    });
    const studentsInvolved = totalStudents > 0 ? Math.round((activeUsers / totalStudents) * 100) : 0;

    res.json({
      treesPlanted,
      wasteRecycled,
      studentsInvolved,
      totalStudents,
      totalActivities,
      totalPoints
    });
  } catch (error) {
    console.error('Stats calculation error:', error);
    res.status(500).json({ message: 'Failed to calculate statistics' });
  }
};

// Recalculate and update all user stats from activities
export const recalculateUserStats = async (req, res) => {
  try {
    console.log('🔄 Starting user stats recalculation...');
    
    const users = await User.find({ role: 'student' });
    let updatedCount = 0;
    
    for (const user of users) {
      // Get all activities for this user
      const activities = await Activity.find({ user: user._id });
      
      // Reset stats
      let treesPlanted = 0;
      let wasteRecycled = 0;
      let activitiesCompleted = activities.length;
      
      // Recalculate from activities
      for (const activity of activities) {
        if (activity.type.toLowerCase().includes('tree') || activity.type.toLowerCase().includes('plant')) {
          const treeMatch = activity.description.match(/(\d+)/);
          const trees = treeMatch ? parseInt(treeMatch[1]) : 1;
          treesPlanted += trees;
        }
        
        if (activity.type.toLowerCase().includes('recycle') || activity.type.toLowerCase().includes('waste')) {
          const wasteMatch = activity.description.match(/(\d+)/);
          const waste = wasteMatch ? parseInt(wasteMatch[1]) : 1;
          wasteRecycled += waste;
        }
      }
      
      // Update user stats
      user.stats = {
        treesPlanted,
        wasteRecycled,
        activitiesCompleted
      };
      
      await user.save();
      updatedCount++;
    }
    
    console.log(`✅ Updated stats for ${updatedCount} users`);
    res.json({ 
      message: `Successfully recalculated stats for ${updatedCount} users`,
      updatedCount 
    });
  } catch (error) {
    console.error('❌ Stats recalculation error:', error);
    res.status(500).json({ message: 'Failed to recalculate user stats' });
  }
};

// Get eco tips
export const getEcoTips = async (req, res) => {
  try {
    const tips = [
      "Use bicycles instead of motorbikes for short distances",
      "Plant at least one tree each month in your community",
      "Recycle and reuse materials whenever possible",
      "Turn off lights and electronics when not in use",
      "Use reusable water bottles and coffee cups",
      "Participate in campus clean-up drives",
      "Carpool with friends to reduce emissions",
      "Buy local and seasonal produce",
      "Use public transportation when available",
      "Start a composting system in your dorm"
    ];
    
    res.json(tips);
  } catch (error) {
    console.error('Tips error:', error);
    res.status(500).json({ message: 'Failed to fetch tips' });
  }
};
