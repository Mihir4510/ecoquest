import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Leaf, TreePine, Droplets, Sprout, Sparkles, ArrowRight } from "lucide-react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/users/register", { name, email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        points: res.data.points,
        level: res.data.level,
        levelName: res.data.levelName,
        streakCount: res.data.streakCount
      }));

      navigate("/Profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Floating animations
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background with Nature Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-green-500 to-emerald-600">
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Animated Floating Elements */}
      <motion.div
        animate={floatingAnimation}
        className="absolute top-16 left-16 text-green-200 opacity-20"
      >
        <Sprout className="w-28 h-28 transform rotate-12" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.7 } }}
        className="absolute bottom-20 right-16 text-teal-200 opacity-20"
      >
        <TreePine className="w-36 h-36 transform -rotate-12" />
      </motion.div>
      <motion.div
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.3 } }}
        className="absolute top-32 right-24 text-emerald-200 opacity-20"
      >
        <Leaf className="w-24 h-24 transform rotate-45" />
      </motion.div>

      {/* Animated Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.6
          }}
          className="absolute text-yellow-200"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 10}%`
          }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      ))}

      {/* Glassmorphism Register Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center items-center space-x-3 mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sprout className="w-10 h-10 text-green-200" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white">Join Eco Quest</h1>
              <motion.div
                animate={{ 
                  y: [0, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Leaf className="w-10 h-10 text-emerald-200" />
              </motion.div>
            </div>
            <p className="text-white/80 text-lg">Start your sustainability journey today 🌱</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/20 backdrop-blur-sm border border-red-300/50 text-white rounded-xl p-3 mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-300 group-focus-within:text-emerald-100 transition-colors">
                  <Leaf className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 focus:border-emerald-300/50 transition-all"
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-300 group-focus-within:text-teal-100 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-teal-300/50 transition-all"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 group-focus-within:text-blue-100 transition-colors">
                  <Droplets className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:border-blue-300/50 transition-all"
                />
              </div>
            </motion.div>

            {/* Submit Button with Growing Plant Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 group"
              >
                {/* Growing Plant Animation on Hover */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity"
                  animate={{
                    scale: [0, 1, 1.5],
                    y: [20, 0, -20]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <Sprout className="w-16 h-16" />
                </motion.div>
                
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{loading ? "Creating Account..." : "Start Your Journey"}</span>
                  {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-white/80">
              Already an eco warrior?{" "}
              <Link
                to="/Login"
                className="text-emerald-200 hover:text-white font-semibold underline decoration-wavy decoration-emerald-300 transition-colors"
              >
                Login here
              </Link>
            </p>
          </motion.div>

          {/* Eco Fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
          >
            <p className="text-white/70 text-sm text-center italic">
              🌍 "Every small action counts. Join thousands making a difference!"
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-10 -left-10 text-emerald-300 opacity-30"
        >
          <TreePine className="w-28 h-28" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute -top-10 -right-10 text-green-300 opacity-30"
        >
          <Sprout className="w-24 h-24" />
        </motion.div>
      </motion.div>

      {/* Animated Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 right-0 h-full opacity-10"
        >
          <svg viewBox="0 0 1440 320" className="w-[200%]" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,149.3C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
