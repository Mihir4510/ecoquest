import Challenge from "../models/Challenge.js";
import User from "../models/user.js";

// Get all active challenges
export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .populate("participants.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(challenges);
  } catch (error) {
    console.error("❌ Error fetching challenges:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Get challenges for a specific user (joined or completed)
export const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user._id;

    const challenges = await Challenge.find({
      "participants.user": userId,
      isActive: true
    }).populate("participants.user", "name email");

    // Filter to only show user's participation data
    const userChallenges = challenges.map(challenge => {
      const userParticipation = challenge.participants.find(
        p => p.user._id.toString() === userId.toString()
      );

      return {
        _id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        icon: challenge.icon,
        targetPoints: challenge.targetPoints,
        targetActivities: challenge.targetActivities,
        duration: challenge.duration,
        reward: challenge.reward,
        difficulty: challenge.difficulty,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        userProgress: userParticipation,
        totalParticipants: challenge.participants.length
      };
    });

    res.status(200).json(userChallenges);
  } catch (error) {
    console.error("❌ Error fetching user challenges:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Join a challenge
export const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Check if user already joined
    const alreadyJoined = challenge.participants.some(
      p => p.user.toString() === userId.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "You already joined this challenge" });
    }

    // Add user to participants
    challenge.participants.push({
      user: userId,
      joinedAt: new Date(),
      completed: false,
      progress: {
        currentPoints: 0,
        currentActivities: 0
      }
    });

    await challenge.save();

    res.status(200).json({
      message: "Successfully joined challenge!",
      challenge
    });
  } catch (error) {
    console.error("❌ Error joining challenge:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Update challenge progress (called after activity submission)
export const updateChallengeProgress = async (userId, pointsEarned) => {
  try {
    const activeChallenges = await Challenge.find({
      "participants.user": userId,
      isActive: true
    });

    for (const challenge of activeChallenges) {
      const participantIndex = challenge.participants.findIndex(
        p => p.user.toString() === userId.toString()
      );

      if (participantIndex !== -1 && !challenge.participants[participantIndex].completed) {
        challenge.participants[participantIndex].progress.currentPoints += pointsEarned;
        challenge.participants[participantIndex].progress.currentActivities += 1;

        // Check if challenge is completed
        const progress = challenge.participants[participantIndex].progress;
        if (
          progress.currentPoints >= challenge.targetPoints &&
          progress.currentActivities >= challenge.targetActivities
        ) {
          challenge.participants[participantIndex].completed = true;
          challenge.participants[participantIndex].completedAt = new Date();

          // Award bonus points and badge to user
          const user = await User.findById(userId);
          if (user) {
            user.points += challenge.reward.points;
            if (challenge.reward.badge && !user.badges.includes(challenge.reward.badge)) {
              user.badges.push(challenge.reward.badge);
            }
            await user.save();
          }
        }

        await challenge.save();
      }
    }
  } catch (error) {
    console.error("❌ Error updating challenge progress:", error);
  }
};

// Create a new challenge (admin/system use)
export const createChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      targetPoints,
      targetActivities,
      duration,
      reward,
      difficulty
    } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      icon,
      targetPoints,
      targetActivities,
      duration,
      reward,
      difficulty
    });

    res.status(201).json({
      message: "Challenge created successfully!",
      challenge
    });
  } catch (error) {
    console.error("❌ Error creating challenge:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

