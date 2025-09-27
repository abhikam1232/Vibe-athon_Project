import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Clock, Code, Briefcase, Brain, Book, Trophy } from 'lucide-react';
import { useGoals } from '../context/GoalsContext';
import { useUser } from '../context/UserContext';
import './Goals.css';

const Goals = () => {
  const { goals, addGoal, updateGoalProgress, deleteGoal, getTodayGoals, getGoalStats } = useGoals();
  const { user } = useUser();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'coding-practice',
    target: 5,
    description: ''
  });

  const goalTypes = [
    { id: 'coding-practice', name: 'Coding Practice', icon: Code, color: 'primary' },
    { id: 'dsa-problems', name: 'DSA Problems', icon: Brain, color: 'secondary' },
    { id: 'system-design', name: 'System Design', icon: Trophy, color: 'success' },
    { id: 'mock-interview', name: 'Mock Interview', icon: Briefcase, color: 'warning' },
    { id: 'project-work', name: 'Project Work', icon: Target, color: 'info' },
    { id: 'course-completion', name: 'Course Learning', icon: Book, color: 'purple' }
  ];

  const handleCreateGoal = (e) => {
    e.preventDefault();
    addGoal(newGoal);
    setNewGoal({ title: '', type: 'coding-practice', target: 5, description: '' });
    setShowCreateForm(false);
  };

  const todayGoals = getTodayGoals();
  const stats = getGoalStats();

  return (
    <motion.div 
      className="goals-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="goals-header">
          <div className="header-content">
            <h1><Target size={32} /> Daily Goals</h1>
            <p>Set and track your engineering preparation goals</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={20} /> Create Goal
          </button>
        </div>

        {/* Stats Overview */}
        <div className="goals-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.todayCompleted}</span>
            <span className="stat-label">Completed Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.todayTotal}</span>
            <span className="stat-label">Total Today</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{Math.round(stats.todayCompletionRate)}%</span>
            <span className="stat-label">Completion Rate</span>
          </div>
        </div>

        {/* Create Goal Form */}
        {showCreateForm && (
          <motion.div 
            className="create-goal-form glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3>Create New Goal</h3>
            <form onSubmit={handleCreateGoal}>
              <div className="form-row">
                <div className="form-group">
                  <label>Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g., Solve LeetCode problems"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Goal Type</label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                  >
                    {goalTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Target Count</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
                    min="1"
                    max="50"
                  />
                </div>
                <div className="form-group">
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Additional details..."
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Goal
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Goals List */}
        <div className="goals-list">
          {todayGoals.length === 0 ? (
            <div className="empty-state glass-card">
              <Target size={64} />
              <h3>No goals set for today</h3>
              <p>Create your first goal to start your preparation journey!</p>
              <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                <Plus size={20} /> Create Your First Goal
              </button>
            </div>
          ) : (
            todayGoals.map(goal => {
              const goalType = goalTypes.find(t => t.id === goal.type);
              const Icon = goalType?.icon || Target;
              
              return (
                <motion.div 
                  key={goal.id}
                  className={`goal-card glass-card ${goal.completed ? 'completed' : ''}`}
                  layout
                >
                  <div className="goal-header">
                    <div className={`goal-icon ${goalType?.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="goal-info">
                      <h4>{goal.title}</h4>
                      <p>{goalType?.name}</p>
                    </div>
                    <div className="goal-actions">
                      {!goal.completed && (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => updateGoalProgress(goal.id)}
                        >
                          <Plus size={16} />
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  <div className="goal-progress">
                    <div className="progress-info">
                      <span>Progress: {goal.progress}/{goal.target}</span>
                      <span>{Math.round((goal.progress / goal.target) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {goal.description && (
                    <p className="goal-description">{goal.description}</p>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Goals;
