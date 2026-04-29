import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trophy, Leaf } from 'lucide-react';

const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentNotification, setCurrentNotification] = useState(0);

  const notifications = [
    {
      icon: Sparkles,
      message: "🤖 New AI features available! Try voice logging and AI verification.",
      color: "bg-gradient-to-r from-green-100 to-emerald-100",
      textColor: "text-green-800"
    },
    {
      icon: Trophy,
      message: "🏆 Join the weekly eco-challenge! Top performers get bonus points.",
      color: "bg-gradient-to-r from-green-50 to-teal-50",
      textColor: "text-green-800"
    },
    {
      icon: Leaf,
      message: "🌱 You've saved 15kg CO₂ this month! Keep up the great work!",
      color: "bg-gradient-to-r from-emerald-100 to-green-100",
      textColor: "text-green-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  if (!isVisible) return null;

  const notification = notifications[currentNotification];
  const Icon = notification.icon;

  return (
    <div className={`fixed top-16 left-4 right-4 z-40 animate-fade-in-up`}>
      <div className={`${notification.color} ${notification.textColor} rounded-xl shadow-2xl border-2 border-green-300 p-4 flex items-center space-x-3 animate-shimmer backdrop-blur-sm`}>
        <div className="flex-shrink-0 w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-green-700 drop-shadow-sm" />
        </div>
        <p className="flex-1 text-sm font-bold text-green-800 drop-shadow-md">{notification.message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-2 transition-all duration-200 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
