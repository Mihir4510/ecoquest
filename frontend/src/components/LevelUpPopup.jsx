import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, Award } from "lucide-react";

function LevelUpPopup({ show, levelData, onClose }) {
  if (!show || !levelData) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.4
              }
            }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 max-w-md mx-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Elements */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl"
            />
            
            {/* Sparkles Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    y: [0, -100]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Trophy Icon */}
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              {/* Congratulations Text */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-green-800 mb-2"
              >
                🎉 Congratulations! 🎉
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <p className="text-lg text-green-700 mb-2">
                  You unlocked the
                </p>
                <div className="bg-white rounded-2xl p-4 shadow-lg inline-block mb-3">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl">{levelData.icon}</span>
                    <span className="text-2xl font-bold text-green-800">
                      {levelData.levelName}
                    </span>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <p className="text-md text-green-600 italic">
                  "{levelData.levelMessage}"
                </p>
              </motion.div>

              {/* Badge Unlocked Message */}
              {levelData.badgeUnlocked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                  className="mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-semibold">
                      New Badge Earned!
                    </span>
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue Your Journey! 🌱
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LevelUpPopup;

