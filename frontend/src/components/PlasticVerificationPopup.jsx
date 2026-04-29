import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, Trophy, Sparkles, Award, X, 
  Recycle, TrendingUp, Star, Gift 
} from "lucide-react";

function PlasticVerificationPopup({ show, result, onClose }) {
  if (!show || !result) return null;

  const { pointsEarned, badgesEarned, verification, submission } = result;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
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
            className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

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
              {[...Array(8)].map((_, i) => (
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
                    delay: i * 0.2,
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
            <div className="relative z-10">
              {/* Success Icon */}
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
                className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              {/* Success Message */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-center text-green-800 mb-2"
              >
                🌿 Plastic Verified Successfully! 🎉
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-gray-600 mb-6"
              >
                Great work! Your contribution helps make our planet cleaner!
              </motion.p>

              {/* Verification Details */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 mb-6"
              >
                <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Recycle className="w-5 h-5 text-green-600" />
                  <span>Detected Items</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-sm text-gray-600">Plastic Type</p>
                    <p className="text-lg font-bold text-green-700">{submission?.plasticType || "Mixed Plastic"}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="text-lg font-bold text-blue-700">{verification?.estimatedQuantity || 0} items</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-bold text-purple-700">{verification?.estimatedWeight?.toFixed(3) || 0} kg</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-lg font-bold text-orange-700">{(verification?.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {/* Detected Items List */}
                {verification?.detectedItems && verification.detectedItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-600 mb-2">AI Detected:</p>
                    <div className="flex flex-wrap gap-2">
                      {verification.detectedItems.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          <span>{item.name}</span>
                          <span className="text-xs opacity-75">({(item.confidence * 100).toFixed(0)}%)</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Rewards Section */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-6 text-white"
              >
                <h3 className="font-bold text-xl mb-4 flex items-center space-x-2">
                  <Trophy className="w-6 h-6" />
                  <span>Rewards Earned</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-6 h-6" />
                      <span className="text-sm">Green Points</span>
                    </div>
                    <p className="text-3xl font-bold">+{pointsEarned}</p>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-6 h-6" />
                      <span className="text-sm">Badges</span>
                    </div>
                    <p className="text-3xl font-bold">{badgesEarned?.length || 0}</p>
                  </div>
                </div>

                {/* New Badges */}
                {badgesEarned && badgesEarned.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-4 pt-4 border-t border-white/30"
                  >
                    <p className="text-sm mb-2 flex items-center space-x-1">
                      <Gift className="w-4 h-4" />
                      <span>New Badges Unlocked:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {badgesEarned.map((badge, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                          className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {badge}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Impact Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6"
              >
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Environmental Impact:</p>
                    <p>
                      You've helped prevent {verification?.estimatedWeight?.toFixed(3) || 0} kg of plastic 
                      from polluting our environment. Every small action counts! 🌍
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Continue Recycling! 🌱
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PlasticVerificationPopup;

