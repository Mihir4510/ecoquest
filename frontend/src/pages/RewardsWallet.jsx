// src/pages/RewardsWallet.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Wallet, 
  Gift, 
  Leaf, 
  Sparkles, 
  ChevronLeft,
  ShoppingBag,
  Award,
  Coins,
  TrendingUp,
  X
} from "lucide-react";
import api from "../api";

function RewardsWallet() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error("❌ Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const rewards = [
    {
      id: 1,
      title: "₹10 Cashback",
      points: 1000,
      icon: "💰",
      color: "from-yellow-400 to-yellow-600",
      description: "Direct cashback to your wallet",
    },
    {
      id: 2,
      title: "Amazon Coupon",
      points: 500,
      icon: "🎁",
      color: "from-blue-400 to-blue-600",
      description: "Shop on Amazon with eco points",
    },
    {
      id: 3,
      title: "Eco T-shirt",
      points: 2000,
      icon: "👕",
      color: "from-green-400 to-green-600",
      description: "Premium organic cotton T-shirt",
    },
    {
      id: 4,
      title: "Plant a Tree",
      points: 300,
      icon: "🌳",
      color: "from-emerald-400 to-emerald-600",
      description: "We'll plant a tree in your name",
    },
    {
      id: 5,
      title: "Coffee Voucher",
      points: 750,
      icon: "☕",
      color: "from-amber-400 to-amber-600",
      description: "Free coffee at campus cafe",
    },
    {
      id: 6,
      title: "Eco Backpack",
      points: 3000,
      icon: "🎒",
      color: "from-purple-400 to-purple-600",
      description: "Sustainable bamboo fiber backpack",
    },
  ];

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReward(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
          <p className="text-green-700 font-medium">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  // Calculate preview wallet balance (₹1 per 100 points for display only)
  const previewBalance = user ? (user.points / 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-12">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-green-200 text-9xl opacity-20">🌿</div>
        <div className="absolute bottom-20 right-10 text-emerald-200 text-9xl opacity-20">🍃</div>
        <div className="absolute top-1/2 left-1/4 text-teal-200 text-7xl opacity-10">🌱</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-green-700 hover:text-green-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="ml-2 font-medium">Back to Profile</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-green-100">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || "👤"}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-green-800 mb-1">
                {user?.name || "Eco Warrior"}
              </h1>
              <div className="flex items-center space-x-2 text-green-600">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {user?.points || 0} Eco Points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-8 mb-12">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 text-white/10 text-9xl -mr-8 -mt-8">💰</div>
          <div className="absolute bottom-0 left-0 text-white/10 text-7xl -ml-4 -mb-4">🌿</div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Wallet className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Eco Wallet</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Balance Preview */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Coins className="w-5 h-5 text-yellow-200" />
                  <p className="text-white/90 text-sm font-medium">Preview Balance*</p>
                </div>
                <p className="text-4xl font-bold text-white mb-1">₹{previewBalance}</p>
                <p className="text-white/70 text-xs">*For display only - Coming Soon!</p>
              </div>

              {/* Eco Points */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Leaf className="w-5 h-5 text-green-200" />
                  <p className="text-white/90 text-sm font-medium">Your Eco Points</p>
                </div>
                <p className="text-4xl font-bold text-white mb-1">{user?.points || 0}</p>
                <div className="flex items-center text-white/70 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Keep earning more!</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-400/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300/30">
              <p className="text-white text-sm flex items-start">
                <span className="mr-2">💡</span>
                <span>
                  <strong>Note:</strong> Wallet balance is a preview calculation (100 points = ₹1). 
                  Real redemption coming in future updates!
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Gift className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-green-800">Available Rewards</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canAfford = user && user.points >= reward.points;
              
              return (
                <div
                  key={reward.id}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 ${
                    canAfford 
                      ? 'border-green-200 hover:border-green-400 hover:shadow-2xl hover:-translate-y-2' 
                      : 'border-gray-200 opacity-75'
                  }`}
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${reward.color}`}></div>

                  <div className="p-6">
                    {/* Icon */}
                    <div className="text-6xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">
                      {reward.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-green-800 mb-2 text-center">
                      {reward.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 text-center min-h-[40px]">
                      {reward.description}
                    </p>

                    {/* Points Required */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-semibold text-green-700">
                        {reward.points} points
                      </span>
                    </div>

                    {/* Redeem Button */}
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        canAfford
                          ? `bg-gradient-to-r ${reward.color} text-white hover:shadow-lg transform hover:scale-105`
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? '🎉 Redeem Now' : '🔒 Need More Points'}
                    </button>

                    {/* Points Needed Indicator */}
                    {!canAfford && user && (
                      <p className="text-xs text-red-500 text-center mt-2">
                        Need {reward.points - user.points} more points
                      </p>
                    )}
                  </div>

                  {/* Decorative corner */}
                  {canAfford && (
                    <div className="absolute top-4 right-4">
                      <Award className="w-6 h-6 text-yellow-500 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🌍</div>
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                How Rewards Work
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✨</span>
                  <span>Earn Eco Points by completing green activities</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎁</span>
                  <span>Browse rewards and see what you can redeem</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🚀</span>
                  <span>Real redemption feature coming in future updates!</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🌱</span>
                  <span>Every point represents your contribution to a greener planet</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 p-8 text-center relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-7xl mb-4 animate-bounce">🚀</div>
              <h2 className="text-3xl font-bold text-white">Coming Soon!</h2>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="text-5xl">{selectedReward?.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-green-800">
                      {selectedReward?.title}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedReward?.points} points</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200">
                <p className="text-gray-700 text-center leading-relaxed">
                  🌟 In future updates, you'll be able to redeem your Eco Points for 
                  <strong> real rewards and cashback</strong>! 
                </p>
                <p className="text-gray-600 text-sm text-center mt-3">
                  Keep earning points and stay tuned for this exciting feature!
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Got it! Keep Earning 🌱
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RewardsWallet;


