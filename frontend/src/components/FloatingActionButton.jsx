import React, { useState } from 'react';
import { Bot, Sparkles, Mic, Camera, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Bot,
      label: 'AI Chat',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: () => navigate('/AI')
    },
    {
      icon: Mic,
      label: 'Voice Log',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      action: () => navigate('/AI')
    },
    {
      icon: Camera,
      label: 'AI Verify',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      action: () => navigate('/AI')
    },
    {
      icon: TrendingUp,
      label: 'Impact',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      action: () => navigate('/AI')
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Actions */}
      {isOpen && (
        <div className="mb-4 space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-3 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-lg whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={action.action}
                  className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Sparkles className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Ripple Effect */}
      {isOpen && (
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
      )}
    </div>
  );
};

export default FloatingActionButton;
