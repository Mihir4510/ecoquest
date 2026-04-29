import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Square, Volume2 } from 'lucide-react';
import api from '../api';

const VoiceActivityLogger = ({ onActivityLogged }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError('Speech recognition failed. Please try again.');
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    setError(null);
    setTranscript('');
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceActivity = async () => {
    if (!transcript.trim()) {
      setError('No speech detected. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Send transcript to AI for processing
      const response = await api.post('/ai/verify', {
        description: transcript,
        source: 'voice'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.verified) {
        // Log the activity
        const activityResponse = await api.post('/activities', {
          type: 'Voice Activity',
          description: transcript,
          points: response.data.points
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (onActivityLogged) {
          onActivityLogged({
            type: 'Voice Activity',
            description: transcript,
            points: response.data.points,
            verified: true
          });
        }

        setTranscript('');
        setError(null);
      } else {
        setError('Activity not recognized. Please be more specific about your eco-friendly action.');
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      setError('Failed to process voice activity. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-600">
          <MicOff className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Voice Recognition Not Supported</h3>
          <p className="text-sm">
            Your browser doesn't support voice recognition. Please use Chrome or Safari for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Mic className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-green-700">Voice Activity Logger</h3>
      </div>

      {/* Recording Interface */}
      <div className="text-center mb-6">
        <div className="mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-green-500 hover:bg-green-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {isRecording ? 'Listening... Speak your eco-activity' : 'Tap to start recording'}
        </p>

        {isRecording && (
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Recording...</span>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">What I heard:</h4>
          <p className="text-gray-700 italic">"{transcript}"</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={processVoiceActivity}
          disabled={!transcript.trim() || isProcessing}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Log Activity</span>
            </>
          )}
        </button>

        {audioBlob && (
          <button
            onClick={playAudio}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play</span>
          </button>
        )}
      </div>

      {/* Voice Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">🎤 Voice Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Be specific: "I planted 3 trees in the garden"</li>
          <li>• Include quantities and locations</li>
          <li>• Examples: "I recycled 5kg of plastic", "I biked to campus today"</li>
        </ul>
      </div>

      {/* Example Phrases */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">💡 Try saying:</h4>
        <div className="text-sm text-green-700 space-y-1">
          <p>"I planted 2 trees in the campus garden"</p>
          <p>"I recycled 3kg of paper waste"</p>
          <p>"I biked to class instead of driving"</p>
          <p>"I cleaned up litter from the park"</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceActivityLogger;
