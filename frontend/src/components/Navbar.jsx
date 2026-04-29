// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Activity, 
  Trophy, 
  Bot, 
  User, 
  LogIn, 
  UserPlus,
  LogOut,
  Menu,
  X,
  Sparkles,
  Recycle
} from "lucide-react";
import ParticleBackground from "./ParticleBackground";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/Login");
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home, showAlways: true },
    { path: "/Activities", label: "Activities", icon: Activity, requiresAuth: true },
    { path: "/Leaderboard", label: "Leaderboard", icon: Trophy, showAlways: true },
    { path: "/plastic-buyback", label: "Plastic Buy-Back", icon: Recycle, special: true, requiresAuth: true },
    { path: "/plastic-impact", label: "Impact", icon: Sparkles, showAlways: true },
    { path: "/AI", label: "AI Dashboard", icon: Bot, special: true, showAlways: true },
    { path: "/Profile", label: "Profile", icon: User, requiresAuth: true },
    { path: "/Login", label: "Login", icon: LogIn, hideWhenAuth: true },
    { path: "/Register", label: "Register", icon: UserPlus, hideWhenAuth: true }
  ].filter(item => {
    if (item.showAlways) return true;
    if (item.requiresAuth && !isLoggedIn) return false;
    if (item.hideWhenAuth && isLoggedIn) return false;
    return true;
  });

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b-2 border-green-300' 
        : 'bg-gradient-to-r from-green-600 via-green-500 to-emerald-500'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 animate-float">
                <span className="text-xl">🌱</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 animate-ping"></div>
            </div>
            <div className="flex flex-col">
              <h1 className={`text-xl font-bold transition-colors duration-300 group-hover:scale-105 ${
                isScrolled ? 'text-green-700' : 'text-white'
              }`}>
                Eco Tracker
              </h1>
              <span className={`text-xs -mt-1 transition-colors duration-300 ${
                isScrolled ? 'text-green-600' : 'text-green-100'
              }`}>
                <span className="inline-flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>AI-Powered</span>
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrentActive = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group hover-lift ${
                    isCurrentActive
                      ? isScrolled
                        ? 'bg-green-100 text-green-700 shadow-sm animate-glow'
                        : 'bg-white/20 text-white'
                      : isScrolled
                        ? 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isCurrentActive ? 'animate-pulse' : ''
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  
                  {item.special && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                    </div>
                  )}
                  
                  {isCurrentActive && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full animate-glow ${
                      isScrolled ? 'bg-green-500' : 'bg-yellow-300'
                    }`}></div>
                  )}
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/0 to-emerald-400/0 group-hover:from-green-400/10 group-hover:to-emerald-400/10 transition-all duration-300"></div>
                </Link>
              );
            })}
            
            {/* Logout Button */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group hover-lift ${
                  isScrolled
                    ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'text-gray-600 hover:text-green-700 hover:bg-green-50' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2 ${
              isScrolled 
                ? 'bg-white shadow-lg border border-gray-200' 
                : 'bg-white/10 backdrop-blur-md'
            }`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isCurrentActive = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isCurrentActive
                        ? isScrolled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-white/20 text-white'
                        : isScrolled
                          ? 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                          : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.special && (
                      <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse ml-auto" />
                    )}
                  </Link>
                );
              })}
              
              {/* Mobile Logout Button */}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isScrolled
                      ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Particle Background */}
      {!isScrolled && <ParticleBackground />}
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -top-2 -right-8 w-6 h-6 bg-yellow-300/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 -right-4 w-4 h-4 bg-white/5 rounded-full animate-ping"></div>
      </div>
    </nav>
  );
}

export default Navbar;
