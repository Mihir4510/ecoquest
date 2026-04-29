import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: "🎯"
    },
    targetPoints: {
      type: Number,
      required: true
    },
    targetActivities: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number, // Duration in days
      default: 7
    },
    reward: {
      points: { type: Number, default: 0 },
      badge: { type: String, default: "" }
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium"
    },
    participants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date
      },
      progress: {
        currentPoints: { type: Number, default: 0 },
        currentActivities: { type: Number, default: 0 }
      }
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    }
  },
  { timestamps: true }
);

// Calculate end date based on duration
challengeSchema.pre('save', function(next) {
  if (this.isNew && !this.endDate) {
    this.endDate = new Date(this.startDate.getTime() + (this.duration * 24 * 60 * 60 * 1000));
  }
  next();
});

export default mongoose.model("Challenge", challengeSchema);

