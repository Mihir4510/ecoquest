// // src/middleware/authMiddleware.js
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       console.log("🔑 Incoming token:", token);

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("✅ Decoded JWT:", decoded);

//       const user = await User.findById(decoded.id).select("-password");

//       if (!user) {
//         console.warn("⚠️ User not found for ID:", decoded.id);
//         return res.status(401).json({ message: "Not authorized, user not found" });
//       }

//       req.user = user;
//       console.log("👤 Authenticated user:", req.user._id);

//       next();
//     } catch (error) {
//       console.error("❌ authMiddleware error:", error.message);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     console.warn("⚠️ No token provided in headers");
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };
// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    // 1. Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Otherwise, check cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.warn("⚠️ No token provided in headers or cookies");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.warn("⚠️ User not found for ID:", decoded.id);
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    console.log("👤 Authenticated user:", req.user._id);

    next();
  } catch (error) {
    console.error("❌ authMiddleware error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
