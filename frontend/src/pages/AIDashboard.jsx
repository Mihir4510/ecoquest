import React, { useState } from 'react';
import { Bot, Sparkles, Brain, Mic, Camera, TrendingUp } from 'lucide-react';
import AIChatbot from '../components/AIChatbot';
import AIActivityVerification from '../components/AIActivityVerification';
import CarbonImpactCalculator from '../components/CarbonImpactCalculator';
import AIChallenges from '../components/AIChallenges';
import VoiceActivityLogger from '../components/VoiceActivityLogger';

const AIDashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [showChatbot, setShowChatbot] = useState(false);

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: Bot },
    { id: 'verify', label: 'AI Verification', icon: Camera },
    { id: 'carbon', label: 'Carbon Impact', icon: TrendingUp },
    { id: 'challenges', label: 'AI Challenges', icon: Sparkles },
    { id: 'voice', label: 'Voice Logger', icon: Mic }
  ];

  const handleActivityLogged = (activity) => {
    console.log('Activity logged:', activity);
    // Here you would typically refresh the activities list or show a success message
    alert(`Activity logged successfully! +${activity.points} points earned!`);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="text-center">
            <Brain className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Eco-Advisor</h3>
            <p className="text-gray-600 mb-6">
              Get personalized eco-advice, activity suggestions, and environmental tips from our AI assistant.
            </p>
            <button
              onClick={() => setShowChatbot(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Bot className="w-5 h-5" />
              <span>Start AI Chat</span>
            </button>
          </div>
        );
      case 'verify':
        return <AIActivityVerification onVerificationComplete={handleActivityLogged} />;
      case 'carbon':
        return <CarbonImpactCalculator />;
      case 'challenges':
        return <AIChallenges />;
      case 'voice':
        return <VoiceActivityLogger onActivityLogged={handleActivityLogged} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">AI-Powered Eco Dashboard</h1>
          </div>
          <p className="text-lg opacity-90">
            Experience the future of environmental tracking with AI-powered features
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderActiveTab()}
        </div>
      </div>

      {/* AI Chatbot Modal */}
      {showChatbot && (
        <AIChatbot
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
        />
      )}

      {/* Feature Highlights */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            🤖 AI Features Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <Bot className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">AI Chatbot</h3>
              <p className="text-sm text-gray-600">
                Get personalized eco-advice and activity suggestions from our AI assistant.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <Camera className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">AI Verification</h3>
              <p className="text-sm text-gray-600">
                Upload photos and get AI-powered verification of your eco-activities.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Carbon Impact</h3>
              <p className="text-sm text-gray-600">
                Calculate your environmental impact with AI-powered carbon footprint analysis.
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <Sparkles className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">AI Challenges</h3>
              <p className="text-sm text-gray-600">
                Get personalized eco-challenges generated by AI based on your profile.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <Mic className="w-8 h-8 text-red-600 mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Voice Logger</h3>
              <p className="text-sm text-gray-600">
                Log activities using voice commands with AI-powered speech recognition.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg">
              <Brain className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Smart Analytics</h3>
              <p className="text-sm text-gray-600">
                Get insights and recommendations based on your environmental behavior patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;
