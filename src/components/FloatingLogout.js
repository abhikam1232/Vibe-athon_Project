import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, UserX, Settings, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import './FloatingLogout.css';

const FloatingLogout = ({ onShowOnboarding }) => {
  const { user, setUser } = useUser();
  const { showToast } = useNotifications();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem('skillshala_engineering_user');
    localStorage.removeItem('skillshala_engineering_goals');
    localStorage.removeItem('skillshala_engineering_notifications');
    
    // Reset user state
    setUser(null);
    
    // Close modals
    setShowConfirmLogout(false);
    setIsExpanded(false);
    
    // Show success message
    showToast('Successfully logged out! You can now create a new account.', 'success');
  };

  const handleEditProfile = () => {
    setIsExpanded(false);
    if (onShowOnboarding) {
      onShowOnboarding();
    }
  };

  const handleResetProgress = () => {
    // Reset progress but keep profile
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
    
    setIsExpanded(false);
    showToast('Progress reset successfully!', 'success');
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Action Button */}
      <div className="floating-logout-container">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="floating-menu"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="floating-menu-item edit-profile"
                onClick={handleEditProfile}
                title="Edit Profile"
              >
                <Settings size={18} />
                <span>Edit Profile</span>
              </button>
              
              <button
                className="floating-menu-item reset-progress"
                onClick={handleResetProgress}
                title="Reset Progress"
              >
                <RefreshCw size={18} />
                <span>Reset Progress</span>
              </button>
              
              <button
                className="floating-menu-item logout-item"
                onClick={() => setShowConfirmLogout(true)}
                title="Switch User"
              >
                <LogOut size={18} />
                <span>Switch User</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={`floating-logout-btn ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isExpanded ? 'Close Menu' : 'User Menu'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? <UserX size={20} /> : <LogOut size={20} />}
          </motion.div>
        </motion.button>

        {/* User Avatar Badge */}
        <div className="user-avatar-badge">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showConfirmLogout && (
          <motion.div
            className="logout-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmLogout(false)}
          >
            <motion.div
              className="logout-confirmation-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="logout-modal-header">
                <div className="logout-modal-icon">
                  <LogOut size={32} />
                </div>
                <h3>Switch User Account?</h3>
                <p>You'll be logged out and can create a new account</p>
              </div>
              
              <div className="logout-modal-content">
                <div className="current-user-info">
                  <div className="current-user-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="current-user-details">
                    <h4>{user.name}</h4>
                    <p>{user.degree} • {user.college}</p>
                    <div className="user-stats-mini">
                      <span>{user.points || 0} points</span>
                      <span>{user.streak || 0} day streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="logout-warning">
                  <p>Your progress will be saved and available when you log back in.</p>
                </div>
              </div>
              
              <div className="logout-modal-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-logout"
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
    </>
  );
};

export default FloatingLogout;
