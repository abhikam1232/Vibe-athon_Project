import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const GoalsContext = createContext();

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const { awardPoints } = useUser();

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('skillshala_engineering_goals');
    if (savedGoals) {
      try {
        const goalsData = JSON.parse(savedGoals);
        setGoals(goalsData);
      } catch (error) {
        console.error('Error parsing goals data:', error);
        localStorage.removeItem('skillshala_engineering_goals');
      }
    }
  }, []);

  const saveGoals = (goalsData) => {
    setGoals(goalsData);
    localStorage.setItem('skillshala_engineering_goals', JSON.stringify(goalsData));
  };

  const addGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
    return newGoal;
  };

  const updateGoalProgress = (goalId, increment = 1) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId && !goal.completed) {
        const newProgress = goal.progress + increment;
        const isCompleted = newProgress >= goal.target;
        
        if (isCompleted && !goal.completed) {
          // Award points for completing goal
          const pointsAwarded = calculateGoalPoints(goal);
          awardPoints(pointsAwarded, `Completed goal: ${goal.title}`);
        }
        
        return {
          ...goal,
          progress: Math.min(newProgress, goal.target),
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : goal.completedAt
        };
      }
      return goal;
    });
    
    saveGoals(updatedGoals);
  };

  const deleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const calculateGoalPoints = (goal) => {
    const basePoints = {
      'coding-practice': 15,
      'dsa-problems': 20,
      'system-design': 25,
      'mock-interview': 30,
      'project-work': 35,
      'skill-assessment': 20,
      'course-completion': 40,
      'hackathon': 50
    };
    
    return basePoints[goal.type] || 10;
  };

  const getTodayGoals = () => {
    const today = new Date().toDateString();
    return goals.filter(goal => 
      new Date(goal.createdAt).toDateString() === today
    );
  };

  const getWeeklyGoals = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return goals.filter(goal => 
      new Date(goal.createdAt) >= weekAgo
    );
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => goal.completed);
  };

  const getGoalsByType = (type) => {
    return goals.filter(goal => goal.type === type);
  };

  const getGoalStats = () => {
    const totalGoals = goals.length;
    const completedGoals = getCompletedGoals().length;
    const todayGoals = getTodayGoals();
    const todayCompleted = todayGoals.filter(g => g.completed).length;
    
    return {
      total: totalGoals,
      completed: completedGoals,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      todayTotal: todayGoals.length,
      todayCompleted,
      todayCompletionRate: todayGoals.length > 0 ? (todayCompleted / todayGoals.length) * 100 : 0
    };
  };

  const value = {
    goals,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    getTodayGoals,
    getWeeklyGoals,
    getCompletedGoals,
    getGoalsByType,
    getGoalStats
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};
