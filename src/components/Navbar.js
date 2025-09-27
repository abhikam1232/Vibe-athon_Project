import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Home, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Briefcase, 
  Brain,
  Bell,
  Menu,
  X,
  Calendar
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import UserProfile from './UserProfile';
import './Navbar.css';

const Navbar = ({ onShowOnboarding }) => {
  const { user } = useUser();
  const { getUnreadCount } = useNotifications();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/daily-goals', icon: Calendar, label: 'Daily Goals' },
    { path: '/recommendations', icon: Lightbulb, label: 'Learn' },
    { path: '/skill-assessment', icon: Brain, label: 'Skills' },
    { path: '/placement-prep', icon: Briefcase, label: 'Placements' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <GraduationCap size={32} />
          <span>Skill Shala</span>
          <span className="engineering-badge">Engineering</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu desktop-only">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* User Info & Actions */}
        <div className="nav-actions">
          {user && (
            <div className="user-stats">
              <div className="stat-item points">
                <span className="brand-text">Skill Shala</span>
                <span className="stat-value">{user.points || 0}</span>
              </div>
              <div className="stat-item streak">
                <span className="stat-icon">🔥</span>
                <span className="stat-value">{user.streak || 0}</span>
              </div>
              <div className="stat-item placement-score">
                <span className="stat-icon">🎯</span>
                <span className="stat-value">{user.placementScore || 0}%</span>
              </div>
            </div>
          )}

          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            {getUnreadCount() > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {getUnreadCount() > 99 ? '99+' : getUnreadCount()}
              </Badge>
            )}
          </Button>

          {user && (
            <UserProfile onShowOnboarding={onShowOnboarding} />
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle mobile-only"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`mobile-nav-link ${location.pathname === path ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
