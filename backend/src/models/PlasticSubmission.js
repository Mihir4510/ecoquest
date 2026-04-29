import mongoose from "mongoose";

const plasticSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    aiVerification: {
      verified: {
        type: Boolean,
        default: false
      },
      confidence: {
        type: Number,
        default: 0
      },
      detectedItems: [{
        name: String,
        confidence: Number,
        category: String
      }],
      estimatedQuantity: {
        type: Number,
        default: 0
      },
      estimatedWeight: {
        type: Number, // in kg
        default: 0
      }
    },
    plasticType: {
      type: String,
      enum: ["PET Bottles", "HDPE Containers", "PVC", "LDPE Bags", "PP Containers", "PS Foam", "Mixed Plastic", "Other"],
      default: "Mixed Plastic"
    },
    quantity: {
      type: Number,
      default: 1
    },
    weight: {
      type: Number, // in kg, user can override AI estimate
      default: 0
    },
    disposalMethod: {
      type: String,
      enum: ["Drop-off at Eco Center", "NGO Pickup", "Government Pickup", "Pending"],
      default: "Pending"
    },
    disposalStatus: {
      type: String,
      enum: ["Pending", "Scheduled", "Collected", "Processed"],
      default: "Pending"
    },
    pickupDate: {
      type: Date
    },
    pointsAwarded: {
      type: Number,
      default: 0
    },
    badgesEarned: [{
      type: String
    }],
    status: {
      type: String,
      enum: ["Pending Verification", "Verified", "Rejected", "Processed"],
      default: "Pending Verification"
    },
    rejectionReason: {
      type: String
    },
    adminNotes: {
      type: String
    },
    location: {
      type: String
    }
  },
  { timestamps: true }
);

// Index for faster queries
plasticSubmissionSchema.index({ user: 1, createdAt: -1 });
plasticSubmissionSchema.index({ status: 1 });

export default mongoose.model("PlasticSubmission", plasticSubmissionSchema);

