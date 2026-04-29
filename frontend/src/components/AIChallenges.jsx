import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Star, Target, Sparkles } from 'lucide-react';
import api from '../api';

const AIChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/ai/challenges', {
        campusData: {
          season: getCurrentSeason(),
          weather: 'sunny' // This could be fetched from a weather API
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChallenges(response.data.challenges || []);
    } catch (err) {
      console.error('Challenges error:', err);
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month < 3) return 'winter';
    if (month < 6) return 'spring';
    if (month < 9) return 'summer';
    return 'fall';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'waste reduction': return '♻️';
      case 'transportation': return '🚴';
      case 'energy': return '💡';
      case 'water': return '💧';
      case 'biodiversity': return '🌱';
      default: return '🌍';
    }
  };

  const startChallenge = (challenge) => {
    setActiveChallenge(challenge);
    // Here you would typically save the challenge to user's active challenges
    console.log('Starting challenge:', challenge);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Generating AI challenges...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchChallenges}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-green-700">AI-Generated Eco Challenges</h3>
        <button
          onClick={fetchChallenges}
          className="ml-auto text-sm text-green-600 hover:text-green-800"
        >
          Generate New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {/* Challenge Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
                  <p className="text-sm text-gray-600 capitalize">{challenge.category}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </div>
            </div>

            {/* Challenge Description */}
            <p className="text-gray-700 text-sm mb-4">{challenge.description}</p>

            {/* Challenge Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{challenge.points} pts</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => startChallenge(challenge)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Start Challenge</span>
            </button>
          </div>
        ))}
      </div>

      {/* Active Challenge Display */}
      {activeChallenge && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Active Challenge</h4>
          </div>
          <p className="text-green-700">{activeChallenge.title}</p>
          <p className="text-sm text-green-600 mt-1">
            Duration: {activeChallenge.duration} • Points: {activeChallenge.points}
          </p>
        </div>
      )}

      {/* Challenge Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Challenge Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Complete challenges within the specified duration for full points</li>
          <li>• Take photos as proof of completion</li>
          <li>• Share your progress with friends for motivation</li>
          <li>• Harder challenges give more points but require more commitment</li>
        </ul>
      </div>
    </div>
  );
};

export default AIChallenges;
