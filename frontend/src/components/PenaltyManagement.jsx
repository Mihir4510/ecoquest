import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, XCircle, TrendingDown,
  Clock, Target, RefreshCw, Eye, User, Calendar,
  Zap, Leaf, Droplets, TreePine, Shield
} from 'lucide-react';
import api from '../api';

const PenaltyManagement = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/penalties/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPenalties(response.data.penaltySummary);
    } catch (error) {
      console.error('Failed to fetch penalties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPenaltyTypeIcon = (type) => {
    switch (type) {
      case 'inactivity': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'unsustainable': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'behavior_trend': return <TrendingDown className="w-4 h-4 text-purple-500" />;
      case 'streak_break': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'challenge_failure': return <Target className="w-4 h-4 text-blue-500" />;
      case 'ai_detected': return <Shield className="w-4 h-4 text-indigo-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEcoHealthZone = (score) => {
    if (score >= 80) return { zone: 'green', icon: '🌱', color: 'text-green-600' };
    if (score >= 60) return { zone: 'yellow', icon: '⚠️', color: 'text-yellow-600' };
    return { zone: 'red', icon: '🔴', color: 'text-red-600' };
  };

  const getLevelBadge = (level) => {
    const levelNames = {
      1: '🌱 Seed',
      2: '🌿 Sprout', 
      3: '🌳 Sapling',
      4: '🌲 Tree',
      5: '🌿 Forest',
      6: '🌍 Guardian',
      7: '🌱 Eco Warrior',
      8: '🌿 Green Hero',
      9: '🌍 Earth Protector',
      10: '🌱 Eco Champion'
    };
    
    return levelNames[level] || '🌱 Seed';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
        <span className="ml-3 text-gray-600">Loading penalty data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8" />
              <span>Penalty Management Dashboard</span>
            </h2>
            <p className="text-red-100 mt-2">Monitor and manage user penalties and eco health</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPenalties}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{penalties.length}</p>
            </div>
            <User className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Users with Penalties</p>
              <p className="text-3xl font-bold text-orange-600">
                {penalties.filter(p => p.totalPenalties > 0).length}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Total Points Lost</p>
              <p className="text-3xl font-bold text-red-600">
                {penalties.reduce((sum, p) => sum + p.totalPointsLost, 0)}
              </p>
            </div>
            <TrendingDown className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">Avg Eco Health</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(penalties.reduce((sum, p) => sum + (p.ecoHealth?.score || 100), 0) / penalties.length)}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* User Penalty List */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">User Penalty Overview</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eco Health
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penalties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {penalties.map((user, index) => {
                const healthZone = getEcoHealthZone(user.ecoHealth?.score || 100);
                
                return (
                  <motion.tr
                    key={user.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {getLevelBadge(user.level)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.currentPoints}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{healthZone.icon}</span>
                        <span className={`text-sm font-medium ${healthZone.color}`}>
                          {user.ecoHealth?.score || 100}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.totalPenalties} penalties
                      </div>
                      <div className="text-sm text-red-600 font-medium">
                        -{user.totalPointsLost} points
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedPenalty(user);
                          setShowModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Penalty Details Modal */}
      <AnimatePresence>
        {showModal && selectedPenalty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Penalty Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">User Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedPenalty.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-medium">{getLevelBadge(selectedPenalty.level)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Points</p>
                    <p className="font-medium">{selectedPenalty.currentPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Eco Health</p>
                    <p className="font-medium">
                      {selectedPenalty.ecoHealth?.score || 100} 
                      <span className="ml-1">{getEcoHealthZone(selectedPenalty.ecoHealth?.score || 100).icon}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Penalties */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Recent Penalties</h4>
                <div className="space-y-3">
                  {selectedPenalty.recentPenalties.map((penalty, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getPenaltyTypeIcon(penalty.type)}
                          <span className="text-sm font-medium text-gray-800 capitalize">
                            {penalty.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-red-600">-{penalty.points}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{penalty.reason}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(penalty.date).toLocaleDateString()} at {new Date(penalty.date).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PenaltyManagement;

