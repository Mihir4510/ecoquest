// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     points: { type: Number, default: 0 },
//     stats: {
//       treesPlanted: { type: Number, default: 0 },
//       activitiesCompleted: { type: Number, default: 0 },
//     },
//     badges: [{ type: String }],
//     recentActivities: [
//       {
//         name: String,
//         icon: String,
//         date: String,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Pre-save middleware to hash password
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Method to check entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);

// export default User;
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    points: { type: Number, default: 0 },
    
    // Level System
    level: { type: Number, default: 1 },
    levelName: { type: String, default: "🌱 Seed" },
    levelMessage: { type: String, default: "You started your green journey!" },
    
    // Streak Tracking
    streakCount: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
    
    stats: {
      treesPlanted: { type: Number, default: 0 },
      activitiesCompleted: { type: Number, default: 0 },
      wasteRecycled: { type: Number, default: 0 },
    },
    badges: [{ type: String }],
    recentActivities: [
      {
        name: String,
        icon: String,
        date: String,
      },
    ],
    
    // Penalty System
    penaltyLog: [
      {
        type: { type: String, enum: ['inactivity', 'unsustainable', 'behavior_trend', 'streak_break', 'challenge_failure', 'ai_detected'] },
        points: { type: Number, required: true },
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
        tierMultiplier: { type: Number, default: 1 },
        originalPoints: { type: Number, required: true },
        recovered: { type: Boolean, default: false }
      }
    ],
    
    // Eco Health Tracking
    ecoHealth: {
      score: { type: Number, default: 100 },
      zone: { type: String, enum: ['green', 'yellow', 'red'], default: 'green' },
      lastCalculated: { type: Date, default: Date.now }
    },
    
    // Recovery System
    recoveryChallenges: [
      {
        challengeId: String,
        title: String,
        description: String,
        points: Number,
        completed: { type: Boolean, default: false },
        completedAt: Date
      }
    ]
  },
  { timestamps: true }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
