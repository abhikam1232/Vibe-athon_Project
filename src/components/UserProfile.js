import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Edit3, 
  ChevronDown,
  UserCheck,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import './UserProfile.css';

const UserProfile = ({ onShowOnboarding }) => {
  const { user, setUser } = useUser();
  const { showToast } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('skillshala_engineering_user');
    localStorage.removeItem('skillshala_engineering_goals');
    localStorage.removeItem('skillshala_engineering_notifications');
    
    // Reset user state
    setUser(null);
    
    // Close dropdown and confirmation
    setIsDropdownOpen(false);
    setShowConfirmLogout(false);
    
    // Show success message
    showToast('Successfully switched users! You can now create a new account.', 'success');
  };

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    if (onShowOnboarding) {
      onShowOnboarding();
    }
  };

  const handleResetData = () => {
    // Clear all data but keep user logged in
    localStorage.removeItem('skillshala_engineering_goals');
    localStorage.removeItem('skillshala_engineering_notifications');
    
    // Reset user progress but keep basic info
    const resetUser = {
      ...user,
      points: 0,
      streak: 0,
      placementScore: 0,
      skillsAssessed: [],
      completedChallenges: [],
      achievements: [],
      studyTime: 0
    };
    
    setUser(resetUser);
    localStorage.setItem('skillshala_engineering_user', JSON.stringify(resetUser));
    
    setIsDropdownOpen(false);
    setShowConfirmReset(false);
    
    showToast('Progress data reset successfully! Starting fresh.', 'success');
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  if (!user) return null;

  return (
    <>
      <div className="user-profile-container">
        <button 
          className="user-profile-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-degree">{user.degree} • {user.year}</span>
          </div>
          <ChevronDown 
            size={16} 
            className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className="user-dropdown"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* User Info Section */}
              <div className="dropdown-header">
                <div className="user-avatar-large">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p>{user.degree} - {user.branch}</p>
                  <p className="user-college">{user.college}</p>
                  <span className="join-date">Joined {formatJoinDate(user.joinDate)}</span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="dropdown-stats">
                <div className="stat-item">
                  <span className="stat-value">{user.points || 0}</span>
                  <span className="stat-label">Points</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.streak || 0}</span>
                  <span className="stat-label">Streak</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.placementScore || 0}%</span>
                  <span className="stat-label">Placement</span>
                </div>
              </div>

              {/* Actions Section */}
              <div className="dropdown-actions">
                <button 
                  className="dropdown-action-btn"
                  onClick={handleEditProfile}
                >
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </button>
                
                <button 
                  className="dropdown-action-btn"
                  onClick={() => setShowConfirmReset(true)}
                >
                  <RefreshCw size={16} />
                  <span>Reset Progress</span>
                </button>
                
                <button 
                  className="dropdown-action-btn logout-btn"
                  onClick={() => setShowConfirmLogout(true)}
                >
                  <LogOut size={16} />
                  <span>Switch User</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showConfirmLogout && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmLogout(false)}
          >
            <motion.div
              className="confirmation-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <UserCheck size={24} className="modal-icon logout-icon" />
                <h3>Switch User Account</h3>
              </div>
              
              <div className="modal-content">
                <p>Are you sure you want to switch users? This will:</p>
                <ul>
                  <li>Log you out of the current account</li>
                  <li>Clear all session data</li>
                  <li>Allow you to create a new account or login as different user</li>
                </ul>
                <p className="warning-text">Your progress will be saved and available when you log back in.</p>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary logout-confirm"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Switch User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Data Confirmation Modal */}
      <AnimatePresence>
        {showConfirmReset && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmReset(false)}
          >
            <motion.div
              className="confirmation-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <Trash2 size={24} className="modal-icon reset-icon" />
                <h3>Reset Progress Data</h3>
              </div>
              
              <div className="modal-content">
                <p>Are you sure you want to reset your progress? This will:</p>
                <ul>
                  <li>Reset points, streak, and placement score to 0</li>
                  <li>Clear all goals and achievements</li>
                  <li>Remove skill assessments and study time</li>
                  <li>Keep your profile information intact</li>
                </ul>
                <p className="warning-text">This action cannot be undone!</p>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmReset(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleResetData}
                >
                  <Trash2 size={16} />
                  Reset Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserProfile;
