import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, XCircle, RefreshCw, Target,
  Leaf, Zap, Droplets, TreePine
} from 'lucide-react';
import api from '../api';

const EcoHealthMeter = ({ userId, showDetails = true }) => {
  const [ecoHealth, setEcoHealth] = useState({
    score: 100,
    zone: 'green',
    color: 'green',
    icon: '🌱',
    message: 'Excellent eco performance! Keep up the great work!',
    details: {
      baseScore: 100,
      penaltyDeduction: 0,
      inactivityDeduction: 0,
      streakDeduction: 0,
      activityBonus: 0
    }
  });
  const [penaltyLog, setPenaltyLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recoveryBonus, setRecoveryBonus] = useState(null);

  useEffect(() => {
    fetchEcoHealth();
  }, [userId]);

  const fetchEcoHealth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [healthResponse, penaltyResponse] = await Promise.all([
        api.get(`/penalties/eco-health/${userId || ''}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get(`/penalties/log/${userId || ''}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setEcoHealth(healthResponse.data.ecoHealth);
      setPenaltyLog(penaltyResponse.data.penaltyLog);
      setRecoveryBonus(healthResponse.data.recoveryBonus);
    } catch (error) {
      console.error('Failed to fetch eco health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getZoneConfig = (zone) => {
    switch (zone) {
      case 'green':
        return {
          bgGradient: 'from-green-400 to-emerald-500',
          borderColor: 'border-green-500',
          textColor: 'text-green-700',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />
        };
      case 'yellow':
        return {
          bgGradient: 'from-yellow-400 to-orange-500',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-700',
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />
        };
      case 'red':
        return {
          bgGradient: 'from-red-400 to-pink-500',
          borderColor: 'border-red-500',
          textColor: 'text-red-700',
          icon: <XCircle className="w-6 h-6 text-red-600" />
        };
      default:
        return {
          bgGradient: 'from-gray-400 to-gray-500',
          borderColor: 'border-gray-500',
          textColor: 'text-gray-700',
          icon: <Target className="w-6 h-6 text-gray-600" />
        };
    }
  };

  const zoneConfig = getZoneConfig(ecoHealth.zone);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          <span className="ml-3 text-gray-600">Calculating eco health...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{ecoHealth.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Eco Health Meter</h3>
            <p className="text-sm text-gray-600">Your environmental performance</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchEcoHealth}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Health Score Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Health Score</span>
          <span className={`text-lg font-bold ${zoneConfig.textColor}`}>
            {ecoHealth.score}/100
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ecoHealth.score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${zoneConfig.bgGradient} rounded-full relative`}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
          </motion.div>
        </div>

        {/* Zone Indicators */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className={ecoHealth.score >= 80 ? 'font-bold text-green-600' : ''}>
            🌱 Green (80-100)
          </span>
          <span className={ecoHealth.score >= 60 && ecoHealth.score < 80 ? 'font-bold text-yellow-600' : ''}>
            ⚠️ Yellow (60-79)
          </span>
          <span className={ecoHealth.score < 60 ? 'font-bold text-red-600' : ''}>
            🔴 Red (0-59)
          </span>
        </div>
      </div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border-2 ${zoneConfig.borderColor} bg-gradient-to-r ${zoneConfig.bgGradient}/10 mb-6`}
      >
        <div className="flex items-center space-x-3">
          {zoneConfig.icon}
          <p className={`font-medium ${zoneConfig.textColor}`}>
            {ecoHealth.message}
          </p>
        </div>
      </motion.div>

      {/* Recovery Bonus */}
      {recoveryBonus?.eligible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Recovery Bonus!</h4>
              <p className="text-sm text-green-700">{recoveryBonus.reason}</p>
              <p className="text-lg font-bold text-green-600">+{recoveryBonus.bonusPoints} points</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Breakdown */}
      {showDetails && ecoHealth.details && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Health Breakdown</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Base Score</span>
              </div>
              <p className="text-lg font-bold text-green-600">+{ecoHealth.details.baseScore}</p>
            </div>

            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Penalties</span>
              </div>
              <p className="text-lg font-bold text-red-600">
                -{ecoHealth.details.penaltyDeduction + ecoHealth.details.inactivityDeduction + ecoHealth.details.streakDeduction}
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Inactivity</span>
              </div>
              <p className="text-lg font-bold text-yellow-600">-{ecoHealth.details.inactivityDeduction}</p>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Streak</span>
              </div>
              <p className="text-lg font-bold text-blue-600">-{ecoHealth.details.streakDeduction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Penalties */}
      {showDetails && penaltyLog.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">Recent Penalties</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {penaltyLog.slice(0, 5).map((penalty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{penalty.reason}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(penalty.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-red-600">-{penalty.points}</span>
                  {penalty.recovered && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoHealthMeter;

