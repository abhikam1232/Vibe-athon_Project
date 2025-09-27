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
  Trophy,
  Check
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
      label: 'Active Goals',
      value: goalStats.active,
      total: goalStats.total,
      color: 'primary',
      link: '/goals'
    },
    {
      icon: Trophy,
      label: 'Completed Today',
      value: goalStats.completedToday,
      color: 'success',
      link: '/progress'
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: user?.streak || 0,
      suffix: ' days',
      color: 'warning',
      link: '/progress'
    }
  ];

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
        duration: 0.5
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
            <motion.div key={index} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
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
            </motion.div>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Today's Goals */}
          <motion.div variants={itemVariants}>
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
                          {goal.completed ? <Check size={14} /> : <Clock size={14} />}
                        </div>
                        <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {goal.title}
                        </span>
                      </div>
                    ))}
                    {todayGoals.length > 3 && (
                      <div className="text-center text-sm text-gray-500 pt-2">
                        +{todayGoals.length - 3} more goals
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 mb-4">No goals set for today</p>
                    <Button size="sm">Set Goals</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy size={16} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Goal completed</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Earned 50 points</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Calendar size={16} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New goal created</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievement Section */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award size={20} />
                Recent Achievements
              </CardTitle>
              <CardDescription>
                Celebrate your learning milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Trophy size={16} />
                  Goal Achiever
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Zap size={16} />
                  Week Streak
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Star size={16} />
                  Top Performer
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
