import React, { useState } from 'react';
import { Upload, Camera, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api';

const AIActivityVerification = ({ onVerificationComplete }) => {
  const [activityDescription, setActivityDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!activityDescription.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/ai/verify', {
        description: activityDescription,
        imageBase64: uploadedImage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVerificationResult(response.data);
      
      if (response.data.verified && onVerificationComplete) {
        onVerificationComplete({
          description: activityDescription,
          points: response.data.points,
          verified: true
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        verified: false,
        points: 0,
        confidence: 0,
        reason: 'Verification failed. Please try again.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-green-700">AI Activity Verification</h3>
      </div>

      <form onSubmit={handleVerification} className="space-y-4">
        {/* Activity Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your eco-activity
          </label>
          <textarea
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            placeholder="e.g., Planted 3 trees in the campus garden, cleaned up 2kg of plastic waste from the beach..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload photo (optional but recommended)
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {uploadedImage && (
              <div className="flex items-center space-x-2">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!activityDescription.trim() || isVerifying}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isVerifying ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>AI is verifying...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Verify with AI</span>
            </>
          )}
        </button>
      </form>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`mt-4 p-4 rounded-lg ${
          verificationResult.verified 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {verificationResult.verified ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-semibold ${
              verificationResult.verified ? 'text-green-800' : 'text-red-800'
            }`}>
              {verificationResult.verified ? 'Activity Verified!' : 'Verification Failed'}
            </span>
          </div>
          
          <div className="space-y-1 text-sm">
            <p><strong>Points Awarded:</strong> {verificationResult.points}</p>
            <p><strong>Confidence:</strong> {Math.round(verificationResult.confidence * 100)}%</p>
            <p><strong>Reason:</strong> {verificationResult.reason}</p>
          </div>
        </div>
      )}

      {/* AI Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 AI Tips for Better Verification:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific about what you did and where</li>
          <li>• Include quantities (e.g., "3 trees", "2kg waste")</li>
          <li>• Upload clear photos showing the activity</li>
          <li>• Mention the environmental impact</li>
        </ul>
      </div>
    </div>
  );
};

export default AIActivityVerification;
