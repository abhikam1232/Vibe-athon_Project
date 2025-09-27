import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('skillshala_engineering_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('skillshala_engineering_user');
      }
    }
    setLoading(false);
  }, []);

  // Listen for user changes (logout/login)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'skillshala_engineering_user') {
        if (e.newValue === null) {
          // User was logged out
          setUser(null);
        } else {
          // User data was updated
          try {
            const userData = JSON.parse(e.newValue);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing updated user data:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('skillshala_engineering_user', JSON.stringify(updatedUser));
  };

  const awardPoints = (points, reason = '') => {
    const newPoints = (user?.points || 0) + points;
    updateUser({ points: newPoints });
    
    // Check for achievements
    checkAchievements(newPoints);
    
    return newPoints;
  };

  const updatePlacementScore = (score) => {
    updateUser({ placementScore: Math.max(user?.placementScore || 0, score) });
  };

  const addSkillAssessment = (skill, score) => {
    const skillsAssessed = user?.skillsAssessed || [];
    const existingSkillIndex = skillsAssessed.findIndex(s => s.skill === skill);
    
    if (existingSkillIndex >= 0) {
      skillsAssessed[existingSkillIndex] = { skill, score, date: new Date().toISOString() };
    } else {
      skillsAssessed.push({ skill, score, date: new Date().toISOString() });
    }
    
    updateUser({ skillsAssessed });
  };

  const completeChallenge = (challengeId, score) => {
    const completedChallenges = user?.completedChallenges || [];
    if (!completedChallenges.includes(challengeId)) {
      completedChallenges.push(challengeId);
      updateUser({ completedChallenges });
      awardPoints(score, `Challenge ${challengeId} completed`);
    }
  };

  const checkAchievements = (points) => {
    const achievements = user?.achievements || [];
    const newAchievements = [];

    // Points-based achievements
    if (points >= 100 && !achievements.find(a => a.id === 'first_hundred')) {
      newAchievements.push({
        id: 'first_hundred',
        name: 'Century Club',
        description: 'Earned your first 100 points',
        icon: '💯',
        earnedAt: new Date().toISOString()
      });
    }

    if (points >= 500 && !achievements.find(a => a.id === 'five_hundred')) {
      newAchievements.push({
        id: 'five_hundred',
        name: 'Rising Star',
        description: 'Earned 500 points',
        icon: '⭐',
        earnedAt: new Date().toISOString()
      });
    }

    if (points >= 1000 && !achievements.find(a => a.id === 'thousand')) {
      newAchievements.push({
        id: 'thousand',
        name: 'Elite Coder',
        description: 'Earned 1000 points',
        icon: '🏆',
        earnedAt: new Date().toISOString()
      });
    }

    // Skill-based achievements
    const skillsCount = user?.skillsAssessed?.length || 0;
    if (skillsCount >= 5 && !achievements.find(a => a.id === 'skill_explorer')) {
      newAchievements.push({
        id: 'skill_explorer',
        name: 'Skill Explorer',
        description: 'Assessed 5 different skills',
        icon: '🔍',
        earnedAt: new Date().toISOString()
      });
    }

    if (newAchievements.length > 0) {
      updateUser({ achievements: [...achievements, ...newAchievements] });
    }
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = user?.lastActive ? new Date(user.lastActive).toDateString() : null;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      let newStreak = 1;
      if (lastActive === yesterdayStr) {
        newStreak = (user?.streak || 0) + 1;
      }
      
      updateUser({ 
        streak: newStreak, 
        lastActive: new Date().toISOString() 
      });
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('skillshala_engineering_user');
    localStorage.removeItem('skillshala_engineering_goals');
    localStorage.removeItem('skillshala_engineering_notifications');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    updateUser,
    awardPoints,
    updatePlacementScore,
    addSkillAssessment,
    completeChallenge,
    updateStreak,
    logoutUser,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
