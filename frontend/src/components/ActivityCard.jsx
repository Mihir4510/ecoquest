// src/components/ActivityCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";

function ActivityCard({ title, description, points, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transform transition-all duration-300 hover:shadow-3xl flex flex-col justify-between min-h-[200px]"
    >
      {/* Icon and Title */}
      <div className="flex items-center mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl mr-4"
        >
          {icon || "✅"}
        </motion.div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-white/80 mb-4 text-sm leading-relaxed flex-grow">{description}</p>

      {/* Points */}
      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full shadow-lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          +{points || 0} pts
        </motion.div>
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
      </div>
    </motion.div>
  );
}

export default ActivityCard;
