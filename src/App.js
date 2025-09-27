import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import OnboardingModal from './components/OnboardingModal';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import Recommendations from './components/Recommendations';
import Progress from './components/Progress';
import PlacementPrep from './components/PlacementPrep';
import SkillAssessment from './components/SkillAssessment';
import NotificationPanel from './components/NotificationPanel';
import Toast from './components/Toast';
import FloatingLogout from './components/FloatingLogout';
import DailyGoals from './components/DailyGoals';

// Context
import { UserProvider } from './context/UserContext';
import { GoalsProvider } from './context/GoalsContext';
import { NotificationProvider } from './context/NotificationContext';

// Styles
import './styles/premium-theme.css';
import './styles/tailwind-utilities.css';
import './App.css';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const userData = localStorage.getItem('skillshala_engineering_user');
    if (!userData) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  return (
    <UserProvider>
      <GoalsProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Navbar onShowOnboarding={handleShowOnboarding} />
              
              <AnimatePresence>
                {showOnboarding && (
                  <OnboardingModal onComplete={handleOnboardingComplete} />
                )}
              </AnimatePresence>

              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/daily-goals" element={<DailyGoals />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/placement-prep" element={<PlacementPrep />} />
                  <Route path="/skill-assessment" element={<SkillAssessment />} />
                </Routes>
              </main>

              <NotificationPanel />
              <FloatingLogout onShowOnboarding={handleShowOnboarding} />
              <Toast />
            </div>
          </Router>
        </NotificationProvider>
      </GoalsProvider>
    </UserProvider>
  );
}

export default App;
