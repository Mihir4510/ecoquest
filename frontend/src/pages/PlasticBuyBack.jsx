import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Recycle, Upload, Camera, CheckCircle, XCircle, Trophy,
  Leaf, Sparkles, ArrowRight, Info, MapPin, Package
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import PlasticVerificationPopup from "../components/PlasticVerificationPopup";

function PlasticBuyBack() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [disposalMethod, setDisposalMethod] = useState("Pending");
  const [location, setLocation] = useState("");
  const [mySubmissions, setMySubmissions] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/plastic-buyback/my-submissions", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMySubmissions(res.data.submissions);
      setMyStats(res.data.stats);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit plastic");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("plasticImage", selectedImage);
      formData.append("disposalMethod", disposalMethod);
      formData.append("location", location);

      const res = await api.post("/plastic-buyback/submit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.success) {
        setVerificationResult(res.data);
        setShowResultPopup(true);
        
        // Reset form
        setSelectedImage(null);
        setImagePreview(null);
        setLocation("");
        setDisposalMethod("Pending");
        
        // Refresh submissions
        fetchMySubmissions();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to submit plastic. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <ToastContainer />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Recycle className="w-12 h-12 text-green-600 animate-spin-slow" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Plastic Buy-Back
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600">
            Turn your plastic waste into rewards! 🌍 Upload, Verify, Earn Points!
          </p>
        </div>

        {/* Stats Cards */}
        {myStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Total Submissions</p>
                  <p className="text-3xl font-bold text-green-600">{myStats.totalSubmissions}</p>
                </div>
                <Package className="w-12 h-12 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Plastic Recycled</p>
                  <p className="text-3xl font-bold text-blue-600">{myStats.totalWeight.toFixed(2)} kg</p>
                </div>
                <Recycle className="w-12 h-12 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-medium">Points Earned</p>
                  <p className="text-3xl font-bold text-yellow-600">{myStats.totalPoints}</p>
                </div>
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Camera className="w-6 h-6 text-green-600" />
            <span>Upload Plastic Waste</span>
          </h2>

          {/* Image Preview */}
          <div className="mb-6">
            <div className="relative w-full h-64 bg-gray-100 rounded-2xl border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No image selected</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="plastic-image-input"
            />
            <label
              htmlFor="plastic-image-input"
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Choose Image</span>
            </label>
          </div>

          {/* Location Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Campus Cafeteria"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Disposal Method */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Disposal Method</label>
            <select
              value={disposalMethod}
              onChange={(e) => setDisposalMethod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Pending">Will decide later</option>
              <option value="Drop-off at Eco Center">Drop-off at Eco Center</option>
              <option value="NGO Pickup">NGO Pickup</option>
              <option value="Government Pickup">Government Pickup</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={uploading || !selectedImage}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Verifying with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Verify & Earn Rewards</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </motion.button>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload a clear photo of plastic waste</li>
                  <li>AI verifies the plastic items</li>
                  <li>Earn points & badges automatically</li>
                  <li>Choose disposal method</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <span>My Recent Submissions</span>
          </h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {mySubmissions.length === 0 ? (
              <div className="text-center py-12">
                <Recycle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No submissions yet</p>
                <p className="text-sm text-gray-400">Upload your first plastic waste!</p>
              </div>
            ) : (
              mySubmissions.map((submission, index) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={`http://localhost:5000${submission.imageUrl}`}
                      alt="Plastic"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{submission.plasticType}</span>
                        {submission.status === "Verified" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {submission.quantity} item(s) • {submission.weight.toFixed(3)} kg
                      </p>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          +{submission.pointsAwarded} pts
                        </span>
                        <span className="text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {submission.badgesEarned && submission.badgesEarned.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {submission.badgesEarned.map((badge, i) => (
                            <span key={i} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Verification Result Popup */}
      <PlasticVerificationPopup
        show={showResultPopup}
        result={verificationResult}
        onClose={() => setShowResultPopup(false)}
      />
    </div>
  );
}

export default PlasticBuyBack;

