import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Target, Calendar, Star, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useGoals } from '../context/GoalsContext';
import './Progress.css';

const Progress = () => {
  const { user } = useUser();
  const { getGoalStats, getCompletedGoals } = useGoals();

  const stats = getGoalStats();
  const completedGoals = getCompletedGoals();
  const achievements = user?.achievements || [];

  const progressMetrics = [
    {
      icon: Target,
      label: 'Goals Completed',
      value: stats.completed,
      total: stats.total,
      color: 'primary'
    },
    {
      icon: Star,
      label: 'Total Points',
      value: user?.points || 0,
      color: 'warning'
    },
    {
      icon: TrendingUp,
      label: 'Placement Score',
      value: user?.placementScore || 0,
      suffix: '%',
      color: 'success'
    },
    {
      icon: Calendar,
      label: 'Study Streak',
      value: user?.streak || 0,
      suffix: 'days',
      color: 'info'
    }
  ];

  return (
    <motion.div 
      className="progress-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="progress-header">
          <h1><TrendingUp size={32} /> Your Progress</h1>
          <p>Track your engineering preparation journey</p>
        </div>

        {/* Progress Metrics */}
        <div className="metrics-grid">
          {progressMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className={`metric-card glass-card ${metric.color}`}>
                <div className="metric-icon">
                  <Icon size={24} />
                </div>
                <div className="metric-content">
                  <div className="metric-value">
                    {metric.value}
                    {metric.total && <span className="metric-total">/{metric.total}</span>}
                    {metric.suffix && <span className="metric-suffix">{metric.suffix}</span>}
                  </div>
                  <div className="metric-label">{metric.label}</div>
                  {metric.total && (
                    <div className="metric-progress">
                      <div 
                        className="metric-progress-fill"
                        style={{ width: `${(metric.value / metric.total) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="progress-content">
          {/* Achievements */}
          <div className="achievements-section glass-card">
            <h3><Trophy size={24} /> Achievements</h3>
            {achievements.length === 0 ? (
              <div className="empty-achievements">
                <Award size={48} />
                <p>Start completing goals to earn achievements!</p>
              </div>
            ) : (
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      <span className="achievement-date">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Goals */}
          <div className="recent-goals-section glass-card">
            <h3><Target size={24} /> Recent Completed Goals</h3>
            {completedGoals.length === 0 ? (
              <div className="empty-goals">
                <Target size={48} />
                <p>Complete your first goal to see it here!</p>
              </div>
            ) : (
              <div className="goals-list">
                {completedGoals.slice(-5).reverse().map(goal => (
                  <div key={goal.id} className="goal-item">
                    <div className="goal-info">
                      <h4>{goal.title}</h4>
                      <p>{goal.type} • Completed on {new Date(goal.completedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="goal-badge">✓</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Progress;
