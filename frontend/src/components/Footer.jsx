// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="bg-green-100 text-green-800 py-4 mt-10 border-t border-green-300">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-semibold">🌱 Built with ❤️ by Team Pantastic</p>
        <p className="text-sm">© {new Date().getFullYear()} College Eco Tracker</p>
      </div>
    </footer>
  );
}

export default Footer;
