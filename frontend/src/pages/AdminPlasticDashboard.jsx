import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Package, CheckCircle, XCircle, Clock, 
  Filter, Search, Download, Eye, Edit, Trash2,
  TrendingUp, Users, Calendar, MapPin
} from "lucide-react";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";

function AdminPlasticDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, filter, searchTerm]);

  const fetchAllSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/plastic-buyback/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Filter by status
    if (filter !== "all") {
      filtered = filtered.filter(s => s.status.toLowerCase() === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.plasticType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/plastic-buyback/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchAllSubmissions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/plastic-buyback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Submission deleted");
      fetchAllSubmissions();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete submission");
    }
  };

  const exportToCSV = () => {
    const headers = ["User", "Plastic Type", "Quantity", "Weight (kg)", "Points", "Status", "Date", "Location"];
    const rows = filteredSubmissions.map(s => [
      s.user?.name || "Unknown",
      s.plasticType,
      s.quantity,
      s.weight,
      s.pointsAwarded,
      s.status,
      new Date(s.createdAt).toLocaleDateString(),
      s.location || "N/A"
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `plastic_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case "verified": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected": return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending": return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700"
    };
    return styles[status.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  const stats = {
    total: submissions.length,
    verified: submissions.filter(s => s.status === "Verified").length,
    pending: submissions.filter(s => s.status === "Pending").length,
    rejected: submissions.filter(s => s.status === "Rejected").length,
    totalWeight: submissions.reduce((sum, s) => sum + (s.weight || 0), 0),
    totalPoints: submissions.reduce((sum, s) => sum + (s.pointsAwarded || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center space-x-3">
              <Shield className="w-10 h-10 text-green-600" />
              <span>Admin Plastic Dashboard</span>
            </h1>
            <p className="text-gray-600 mt-2">Monitor and manage plastic submissions</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.verified}</p>
            <p className="text-sm text-gray-600">Verified</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <Clock className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <XCircle className="w-8 h-8 text-red-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalWeight.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total (kg)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <Users className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.totalPoints}</p>
            <p className="text-sm text-gray-600">Points</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user, type, or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {["all", "verified", "pending", "rejected"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Qty/Weight</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-semibold">
                              {submission.user?.name?.charAt(0) || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{submission.user?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{submission.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{submission.plasticType}</p>
                        {submission.location && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {submission.location}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-800">{submission.quantity} items</p>
                        <p className="text-sm text-gray-500">{submission.weight.toFixed(3)} kg</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-green-600">
                          {submission.pointsAwarded}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span>{submission.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowDetailModal(true);
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(submission._id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Submission Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Image */}
              <div>
                <img
                  src={`http://localhost:5000${selectedSubmission.imageUrl}`}
                  alt="Plastic"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="font-semibold text-gray-800">{selectedSubmission.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plastic Type</p>
                  <p className="font-semibold text-gray-800">{selectedSubmission.plasticType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-semibold text-gray-800">{selectedSubmission.quantity} items</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-semibold text-gray-800">{selectedSubmission.weight.toFixed(3)} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Points Awarded</p>
                  <p className="font-semibold text-green-600">{selectedSubmission.pointsAwarded}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disposal Method</p>
                  <p className="font-semibold text-gray-800">{selectedSubmission.disposalMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">{selectedSubmission.location || "Not specified"}</p>
                </div>
              </div>

              {/* AI Verification Details */}
              {selectedSubmission.aiVerification && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">AI Verification</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-600">Confidence: </span>
                      <span className="font-medium">{(selectedSubmission.aiVerification.confidence * 100).toFixed(0)}%</span>
                    </p>
                    {selectedSubmission.aiVerification.detectedItems?.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Detected Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSubmission.aiVerification.detectedItems.map((item, i) => (
                            <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              {item.name} ({(item.confidence * 100).toFixed(0)}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                {selectedSubmission.status !== "Verified" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, "Verified");
                      setShowDetailModal(false);
                    }}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                )}
                {selectedSubmission.status !== "Rejected" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedSubmission._id, "Rejected");
                      setShowDetailModal(false);
                    }}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPlasticDashboard;

