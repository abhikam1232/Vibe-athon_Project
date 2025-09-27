import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Target, 
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  RotateCcw
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Progress } from './ui/Progress';
import { Badge } from './ui/Badge';
import { Separator } from './ui/Separator';
import './DailyGoals.css';

const DailyGoals = () => {
  const { awardPoints } = useUser();
  const { showToast } = useNotifications();
  
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [editText, setEditText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load goals from localStorage on component mount
  useEffect(() => {
    const today = new Date().toDateString();
    const savedGoals = localStorage.getItem(`daily_goals_${today}`);
    
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error loading daily goals:', error);
        setGoals([]);
      }
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`daily_goals_${today}`, JSON.stringify(goals));
  }, [goals]);

  // Calculate progress
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  // Add new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoal.trim()) {
      const goal = {
        id: Date.now(),
        text: newGoal.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      
      setGoals(prev => [...prev, goal]);
      setNewGoal('');
      setShowAddForm(false);
      showToast('Goal added successfully!', 'success');
    }
  };

  // Toggle goal completion
  const toggleGoal = (goalId) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const wasCompleted = goal.completed;
        const updatedGoal = {
          ...goal,
          completed: !goal.completed,
          completedAt: !goal.completed ? new Date().toISOString() : null
        };
        
        // Award points for completing goal
        if (!wasCompleted && updatedGoal.completed) {
          awardPoints(10, 'Daily goal completed');
          showToast('Goal completed! +10 points', 'success');
        }
        
        return updatedGoal;
      }
      return goal;
    }));
  };

  // Delete goal
  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    showToast('Goal deleted', 'info');
  };

  // Start editing goal
  const startEditing = (goal) => {
    setEditingGoal(goal.id);
    setEditText(goal.text);
  };

  // Save edited goal
  const saveEdit = () => {
    if (editText.trim()) {
      setGoals(prev => prev.map(goal => 
        goal.id === editingGoal 
          ? { ...goal, text: editText.trim() }
          : goal
      ));
      setEditingGoal(null);
      setEditText('');
      showToast('Goal updated successfully!', 'success');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingGoal(null);
    setEditText('');
  };

  // Clear completed goals
  const clearCompletedGoals = () => {
    const completedCount = completedGoals;
    setGoals(prev => prev.filter(goal => !goal.completed));
    showToast(`${completedCount} completed goals cleared!`, 'info');
  };

  // Reset all goals
  const resetAllGoals = () => {
    if (window.confirm('Are you sure you want to reset all daily goals? This action cannot be undone.')) {
      setGoals([]);
      showToast('All goals reset!', 'warning');
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="daily-goals-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="daily-goals-wrapper">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target size={32} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl mb-2">Daily Learning Goals</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <Calendar size={16} />
                    {getCurrentDate()}
                  </CardDescription>
                </div>
              </div>
              
              <Button
                onClick={() => setShowAddForm(true)}
                size="lg"
                className="shadow-lg"
              >
                <Plus size={20} />
                Add Goal
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Today's Progress</CardTitle>
              <Badge variant="secondary" className="text-sm">
                {completedGoals} of {totalGoals} goals completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Progress value={progressPercentage} className="flex-1" />
                <span className="text-2xl font-bold text-orange-600 min-w-[60px] text-right">
                  {Math.round(progressPercentage)}%
                </span>
              </div>

              {totalGoals > 0 && (
                <div className="flex gap-3 pt-2">
                  {completedGoals > 0 && (
                    <Button
                      onClick={clearCompletedGoals}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      <CheckCircle2 size={16} />
                      Clear Completed ({completedGoals})
                    </Button>
                  )}
                  
                  <Button
                    onClick={resetAllGoals}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <RotateCcw size={16} />
                    Reset All
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Goal Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Goal</CardTitle>
                  <CardDescription>
                    Set a specific learning objective for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddGoal} className="space-y-4">
                    <Input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Enter your learning goal (e.g., Watch 2 React tutorials)"
                      autoFocus
                      className="text-base"
                    />
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewGoal('');
                        }}
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!newGoal.trim()}
                      >
                        <Check size={16} />
                        Add Goal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Today's Goals</CardTitle>
            <CardDescription>
              Track your daily learning objectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals set for today</h3>
                <p className="text-gray-600 mb-6">Add your first learning goal to get started!</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="lg"
                >
                  <Plus size={20} />
                  Add Your First Goal
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {goals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                        goal.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <button
                        onClick={() => toggleGoal(goal.id)}
                        className={`flex-shrink-0 transition-colors ${
                          goal.completed ? 'text-green-600' : 'text-gray-400 hover:text-orange-500'
                        }`}
                      >
                        {goal.completed ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <Circle size={24} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        {editingGoal === goal.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1"
                              autoFocus
                            />
                            <Button
                              onClick={saveEdit}
                              size="sm"
                              disabled={!editText.trim()}
                            >
                              <Check size={16} />
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              variant="outline"
                              size="sm"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className={`text-base font-medium ${
                              goal.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {goal.text}
                            </p>
                            {goal.completed && goal.completedAt && (
                              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                                <Clock size={12} />
                                Completed at {new Date(goal.completedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      {editingGoal !== goal.id && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => startEditing(goal)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-orange-600"
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            onClick={() => deleteGoal(goal.id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Summary */}
        {goals.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Daily Summary</CardTitle>
              <CardDescription>
                Your learning progress overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{totalGoals}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Total Goals</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">{completedGoals}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Completed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{totalGoals - completedGoals}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Remaining</div>
                </div>
              </div>
              
              {progressPercentage === 100 && (
                <motion.div
                  className="text-center p-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg border-2 border-orange-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold text-orange-800 mb-2">Congratulations!</h3>
                  <p className="text-orange-700">You've completed all your daily learning goals!</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default DailyGoals;
