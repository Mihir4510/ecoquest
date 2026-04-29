// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingActionButton from "./components/FloatingActionButton";
import NotificationBanner from "./components/NotificationBanner";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activities from "./pages/Activities";
import EnhancedLeaderboard from "./pages/EnhancedLeaderboard";
import Profile from "./pages/Profile";
import AIDashboard from "./pages/AIDashboard";
import PlasticBuyBack from "./pages/PlasticBuyBack";
import PlasticImpactDashboard from "./pages/PlasticImpactDashboard";
import AdminPlasticDashboard from "./pages/AdminPlasticDashboard";
import RewardsWallet from "./pages/RewardsWallet";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />
        
        {/* Notification Banner */}
        <NotificationBanner />

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-6 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Activities" element={<Activities />} />
            <Route path="/Leaderboard" element={<EnhancedLeaderboard />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/AI" element={<AIDashboard />} />
            <Route path="/plastic-buyback" element={<PlasticBuyBack />} />
            <Route path="/plastic-impact" element={<PlasticImpactDashboard />} />
            <Route path="/admin/plastic" element={<AdminPlasticDashboard />} />
            <Route path="/rewards-wallet" element={<RewardsWallet />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
        
        {/* Floating Action Button */}
        <FloatingActionButton />
      </div>
    </Router>
  );
}

export default App;
