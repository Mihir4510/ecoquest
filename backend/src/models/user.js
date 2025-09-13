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
    role: { type: String, default: "student" }, // ✅ Added role field
    points: { type: Number, default: 0 },
    stats: {
      treesPlanted: { type: Number, default: 0 },
      activitiesCompleted: { type: Number, default: 0 },
    },
    badges: [{ type: String }],
    recentActivities: [
      {
        name: String,
        icon: String,
        date: String,
      },
    ],
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
