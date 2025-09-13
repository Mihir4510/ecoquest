import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    type: { 
      type: String, 
      required: true,
      trim: true 
    }, // e.g., Tree Planting, Cycling
    description: { 
      type: String, 
      trim: true,
      default: "" 
    },
    points: { 
      type: Number, 
      default: 0,
      min: 0
    },
    verified: { 
      type: Boolean, 
      default: false 
    },
    date: { 
      type: Date, 
      default: Date.now 
    } // Optional: store the activity date
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
