// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold"> Eco Tracker 🌱</h1>

        {/* Links */}
        <div className="space-x-4">
          <Link to="/" className="hover:text-yellow-300">Home</Link>
          <Link to="/Activities" className="hover:text-yellow-300">Activities</Link>
          <Link to="/Leaderboard" className="hover:text-yellow-300">Leaderboard</Link>
          <Link to="/Profile" className="hover:text-yellow-300">Profile</Link>
          <Link to="/Login" className="hover:text-yellow-300">Login</Link>
          <Link to="/Register" className="hover:text-yellow-300">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
