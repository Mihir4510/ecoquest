import PlasticSubmission from "../models/PlasticSubmission.js";
import User from "../models/user.js";
import { verifyPlasticImage, calculatePoints, determineBadges } from "../services/plasticVerificationService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Submit plastic for verification
export const submitPlastic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const { disposalMethod, location } = req.body;
    const userId = req.user._id;
    
    // Get image path
    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    // Verify plastic using Google Cloud Vision AI
    console.log("🔍 Verifying plastic image...");
    const verificationResult = await verifyPlasticImage(imagePath);

    if (!verificationResult.verified) {
      // Delete uploaded image if verification fails
      fs.unlinkSync(imagePath);
      
      return res.status(400).json({
        success: false,
        message: verificationResult.message || "No plastic detected in the image. Please upload a clear image of plastic waste.",
        verification: verificationResult
      });
    }

    // Calculate points
    const points = calculatePoints(
      verificationResult.estimatedQuantity,
      verificationResult.estimatedWeight
    );

    // Create plastic submission
    const submission = await PlasticSubmission.create({
      user: userId,
      imageUrl: imageUrl,
      aiVerification: {
        verified: true,
        confidence: verificationResult.confidence,
        detectedItems: verificationResult.detectedItems,
        estimatedQuantity: verificationResult.estimatedQuantity,
        estimatedWeight: verificationResult.estimatedWeight
      },
      plasticType: verificationResult.plasticType,
      quantity: verificationResult.estimatedQuantity,
      weight: verificationResult.estimatedWeight,
      disposalMethod: disposalMethod || "Pending",
      pointsAwarded: points,
      status: "Verified",
      location: location || ""
    });

    // Update user points and stats
    const user = await User.findById(userId);
    if (user) {
      user.points += points;
      user.stats.activitiesCompleted = (user.stats.activitiesCompleted || 0) + 1;

      // Determine and award badges
      const totalSubmissions = await PlasticSubmission.countDocuments({ 
        user: userId, 
        status: "Verified" 
      });
      
      const totalWeightResult = await PlasticSubmission.aggregate([
        { $match: { user: userId, status: "Verified" } },
        { $group: { _id: null, total: { $sum: "$weight" } } }
      ]);
      
      const totalWeight = totalWeightResult[0]?.total || verificationResult.estimatedWeight;
      
      const newBadges = determineBadges(totalSubmissions, totalWeight);
      const earnedBadges = [];
      
      newBadges.forEach(badge => {
        if (!user.badges.includes(badge)) {
          user.badges.push(badge);
          earnedBadges.push(badge);
        }
      });

      submission.badgesEarned = earnedBadges;
      await submission.save();
      
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Plastic verified successfully!",
      submission: submission,
      pointsEarned: points,
      badgesEarned: submission.badgesEarned,
      verification: verificationResult
    });

  } catch (error) {
    console.error("❌ Error submitting plastic:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error. Please try again." 
    });
  }
};

// Get user's plastic submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await PlasticSubmission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = await PlasticSubmission.aggregate([
      { $match: { user: req.user._id, status: "Verified" } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          totalWeight: { $sum: "$weight" },
          totalPoints: { $sum: "$pointsAwarded" }
        }
      }
    ]);

    res.status(200).json({
      submissions: submissions,
      stats: stats[0] || { totalSubmissions: 0, totalWeight: 0, totalPoints: 0 }
    });

  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get plastic champions leaderboard
export const getPlasticChampions = async (req, res) => {
  try {
    const champions = await PlasticSubmission.aggregate([
      { $match: { status: "Verified" } },
      {
        $group: {
          _id: "$user",
          totalSubmissions: { $sum: 1 },
          totalWeight: { $sum: "$weight" },
          totalPoints: { $sum: "$pointsAwarded" }
        }
      },
      { $sort: { totalWeight: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          name: "$userInfo.name",
          totalSubmissions: 1,
          totalWeight: 1,
          totalPoints: 1
        }
      }
    ]);

    res.status(200).json(champions);

  } catch (error) {
    console.error("❌ Error fetching champions:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get global impact statistics
export const getImpactStats = async (req, res) => {
  try {
    const stats = await PlasticSubmission.aggregate([
      { $match: { status: "Verified" } },
      {
        $group: {
          _id: null,
          totalPlasticRecycled: { $sum: "$weight" },
          totalSubmissions: { $sum: 1 },
          totalPointsAwarded: { $sum: "$pointsAwarded" },
          uniqueUsers: { $addToSet: "$user" }
        }
      }
    ]);

    const result = stats[0] || {
      totalPlasticRecycled: 0,
      totalSubmissions: 0,
      totalPointsAwarded: 0,
      uniqueUsers: []
    };

    res.status(200).json({
      totalPlasticRecycled: Math.round(result.totalPlasticRecycled * 1000) / 1000, // kg
      totalSubmissions: result.totalSubmissions,
      totalPointsAwarded: result.totalPointsAwarded,
      ecoChampions: result.uniqueUsers.length
    });

  } catch (error) {
    console.error("❌ Error fetching impact stats:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Admin: Get all submissions for tracking
export const getAllSubmissions = async (req, res) => {
  try {
    const { status, disposalStatus } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (disposalStatus) query.disposalStatus = disposalStatus;

    const submissions = await PlasticSubmission.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(submissions);

  } catch (error) {
    console.error("❌ Error fetching all submissions:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Admin: Update submission status
export const updateSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { disposalStatus, pickupDate, adminNotes } = req.body;

    const submission = await PlasticSubmission.findByIdAndUpdate(
      submissionId,
      {
        disposalStatus: disposalStatus,
        pickupDate: pickupDate,
        adminNotes: adminNotes
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({
      message: "Submission updated successfully",
      submission: submission
    });

  } catch (error) {
    console.error("❌ Error updating submission:", error);
    res.status(500).json({ message: "Server error." });
  }
};

