import React, { useState, useEffect } from 'react';
import { Leaf, TreePine, Droplets, Zap, TrendingUp } from 'lucide-react';
import api from '../api';

const CarbonImpactCalculator = () => {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateImpact = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/ai/carbon-impact', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setImpact(response.data);
    } catch (err) {
      console.error('Carbon impact error:', err);
      setError('Failed to calculate carbon impact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateImpact();
  }, []);

  const formatNumber = (num) => {
    return num ? num.toFixed(2) : '0.00';
  };

  const getImpactLevel = (co2Saved) => {
    if (co2Saved > 100) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (co2Saved > 50) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (co2Saved > 20) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Getting Started', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Calculating your environmental impact...</span>
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
            onClick={calculateImpact}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!impact) return null;

  const impactLevel = getImpactLevel(impact.co2Saved);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Leaf className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-green-700">Your Environmental Impact</h3>
      </div>

      {/* Impact Level Badge */}
      <div className={`inline-flex items-center px-4 py-2 rounded-full ${impactLevel.bg} mb-6`}>
        <TrendingUp className="w-4 h-4 mr-2" />
        <span className={`font-semibold ${impactLevel.color}`}>
          {impactLevel.level} Impact
        </span>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* CO2 Saved */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-bold text-green-700">
                {formatNumber(impact.co2Saved)} kg
              </p>
            </div>
          </div>
        </div>

        {/* Trees Equivalent */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TreePine className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Trees Equivalent</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatNumber(impact.treesEquivalent)}
              </p>
            </div>
          </div>
        </div>

        {/* Water Saved */}
        <div className="bg-cyan-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Water Saved</p>
              <p className="text-2xl font-bold text-cyan-700">
                {formatNumber(impact.waterSaved)} L
              </p>
            </div>
          </div>
        </div>

        {/* Energy Saved */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Energy Saved</p>
              <p className="text-2xl font-bold text-yellow-700">
                {formatNumber(impact.energySaved)} kWh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Description */}
      {impact.impact && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">🌍 Your Impact Summary</h4>
          <p className="text-gray-700">{impact.impact}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={calculateImpact}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
        >
          Refresh Impact
        </button>
        <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          Share Impact
        </button>
      </div>

      {/* Fun Facts */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">🎯 Did You Know?</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Saving {formatNumber(impact.co2Saved)} kg CO₂ is like taking a car off the road for {Math.round(impact.co2Saved / 4.6)} days!</p>
          <p>• {formatNumber(impact.treesEquivalent)} trees can absorb CO₂ for an entire year</p>
          <p>• You've saved enough water to fill {Math.round(impact.waterSaved / 2)} water bottles</p>
        </div>
      </div>
    </div>
  );
};

export default CarbonImpactCalculator;
