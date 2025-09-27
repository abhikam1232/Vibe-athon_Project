import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Clock, 
  Star,
  Calendar,
  Users,
  Zap,
  Trophy
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useGoals } from '../context/GoalsContext';
import { useNotifications } from '../context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import './Dashboard.css';

const Dashboard = () => {
  const { user, updateStreak } = useUser();
  const { goals, getGoalStats, getTodayGoals } = useGoals();
  const { showToast } = useNotifications();

  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [user, updateStreak]);

  const goalStats = getGoalStats();
  const todayGoals = getTodayGoals();

  const quickStats = [
    {
      icon: Target,
      label: 'Goals Completed Today',
      value: goalStats.todayCompleted,
      total: goalStats.todayTotal,
      color: 'primary',
      link: '/goals'
    },
    {
      icon: Clock,
      label: 'Study Streak',
      value: user?.streak || 0,
      suffix: 'days',
      color: 'streak',
      link: '/progress'
    },
    {
      icon: Trophy,
      label: 'Total Points',
      value: user?.points || 0,
      color: 'points',
      link: '/progress'
    },
    {
      icon: TrendingUp,
      label: 'Placement Score',
      value: user?.placementScore || 0,
      suffix: '%',
      color: 'placement',
      link: '/placement-prep'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Complete DSA Practice',
      type: 'coding',
      dueTime: '2 hours',
      priority: 'high',
      points: 25
    },
    {
      id: 2,
      title: 'System Design Mock Interview',
      type: 'interview',
      dueTime: 'Tomorrow',
      priority: 'medium',
      points: 40
    },
    {
      id: 3,
      title: 'React Project Deployment',
      type: 'project',
      dueTime: '3 days',
      priority: 'low',
      points: 35
    }
  ];

  const recentAchievements = user?.achievements?.slice(-3) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  Welcome back, {user?.name || 'Student'}! 👋
                </CardTitle>
                <CardDescription className="text-lg">
                  Ready to continue your learning journey? Let's achieve your goals today.
                </CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{user?.streak || 0}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user?.points || 0}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                <Target size={20} />
                Set Daily Goal
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <BookOpen size={20} />
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-orange-100 text-orange-600' :
                    stat.color === 'success' ? 'bg-green-100 text-green-600' :
                    stat.color === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                      {stat.total && <span className="text-lg text-gray-500">/{stat.total}</span>}
                      {stat.suffix && <span className="text-lg text-gray-500">{stat.suffix}</span>}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                    {stat.total && (
                      <Progress 
                        value={(stat.value / stat.total) * 100} 
                        className="mt-2 h-2"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Today's Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  Today's Goals
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {todayGoals.length > 0 ? (
                <div className="space-y-3">
                  {todayGoals.slice(0, 3).map(goal => (
                    <div key={goal.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        goal.completed ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {goal.completed ? <Trophy size={14} /> : <Clock size={14} />}
                      </div>
                      <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {goal.title}
                      </span>
                        <span className="progress-text">
                          {goal.progress}/{goal.target}
                        </span>
                      </div>
                    </div>
                  ))}
                  {todayGoals.length > 3 && (
                    <div className="more-goals">
                      +{todayGoals.length - 3} more goals
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div className="dashboard-card glass-card" variants={itemVariants}>
            <div className="card-header">
              <h3>
                <Clock size={20} />
                Upcoming Tasks
              </h3>
              <Link to="/recommendations" className="card-action">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-content">
              <div className="tasks-list">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="task-item">
                    <div className={`task-icon ${task.type}`}>
                      {task.type === 'coding' && <Code size={16} />}
                      {task.type === 'interview' && <Briefcase size={16} />}
                      {task.type === 'project' && <Brain size={16} />}
                    </div>
                    <div className="task-info">
                      <span className="task-title">{task.title}</span>
                      <span className="task-meta">
                        Due in {task.dueTime} • {task.points} points
                      </span>
                    </div>
                    <div className={`task-priority ${task.priority}`}>
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div className="dashboard-card glass-card" variants={itemVariants}>
            <div className="card-header">
              <h3>
                <Trophy size={20} />
                Recent Achievements
              </h3>
              <Link to="/progress" className="card-action">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="card-content">
              {recentAchievements.length === 0 ? (
                <div className="empty-state">
                  <Star size={48} />
                  <p>Start completing goals to earn achievements!</p>
                </div>
              ) : (
                <div className="achievements-list">
                  {recentAchievements.map(achievement => (
                    <div key={achievement.id} className="achievement-item">
                      <div className="achievement-icon">
                        {achievement.icon}
                      </div>
                      <div className="achievement-info">
                        <span className="achievement-name">{achievement.name}</span>
                        <span className="achievement-desc">{achievement.description}</span>
                      </div>
                      <div className="achievement-date">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="dashboard-card glass-card" variants={itemVariants}>
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="quick-actions">
                <Link to="/skill-assessment" className="quick-action-btn coding">
                  <Code size={20} />
                  <span>Practice Coding</span>
                </Link>
                <Link to="/placement-prep" className="quick-action-btn interview">
                  <Briefcase size={20} />
                  <span>Mock Interview</span>
                </Link>
                <Link to="/recommendations" className="quick-action-btn learn">
                  <Brain size={20} />
                  <span>Learn New Skill</span>
                </Link>
                <Link to="/goals" className="quick-action-btn goals">
                  <Target size={20} />
                  <span>Set New Goal</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
