import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code, Target, Rocket } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './OnboardingModal.css';

const OnboardingModal = ({ onComplete }) => {
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    year: '',
    branch: '',
    college: '',
    techStack: [],
    careerGoals: [],
    placementYear: ''
  });

  const degrees = ['BTech', 'BE', 'BCA', 'MCA', 'MTech', 'BSc CS', 'MSc CS'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Graduated'];
  const branches = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Software Engineering',
    'Data Science',
    'AI & Machine Learning',
    'Cyber Security'
  ];

  const techStacks = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'nodejs', name: 'Node.js', icon: '🟢' },
    { id: 'angular', name: 'Angular', icon: '🅰️' },
    { id: 'flutter', name: 'Flutter', icon: '🦋' },
    { id: 'android', name: 'Android', icon: '🤖' },
    { id: 'ios', name: 'iOS', icon: '🍎' },
    { id: 'ml', name: 'Machine Learning', icon: '🧠' },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️' }
  ];

  const careerGoals = [
    { id: 'sde', name: 'Software Developer', icon: '💻' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: '🌐' },
    { id: 'frontend', name: 'Frontend Developer', icon: '🎨' },
    { id: 'backend', name: 'Backend Developer', icon: '⚙️' },
    { id: 'mobile', name: 'Mobile App Developer', icon: '📱' },
    { id: 'devops', name: 'DevOps Engineer', icon: '🔧' },
    { id: 'ml-engineer', name: 'ML Engineer', icon: '🤖' },
    { id: 'data-scientist', name: 'Data Scientist', icon: '📊' },
    { id: 'product-manager', name: 'Product Manager', icon: '📋' },
    { id: 'startup', name: 'Start My Own Company', icon: '🚀' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayToggle = (array, item, setArray) => {
    setFormData(prev => ({
      ...prev,
      [setArray]: prev[setArray].includes(item)
        ? prev[setArray].filter(i => i !== item)
        : [...prev[setArray], item]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      ...formData,
      joinDate: new Date().toISOString(),
      points: 0,
      streak: 0,
      placementScore: 0,
      skillsAssessed: [],
      completedChallenges: [],
      achievements: []
    };

    localStorage.setItem('learnmate_engineering_user', JSON.stringify(userData));
    setUser(userData);
    onComplete();
  };

  return (
    <motion.div
      className="onboarding-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="onboarding-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="onboarding-header">
          <GraduationCap size={48} className="header-icon" />
          <h2>Welcome to Skill Shala Engineering!</h2>
          <p>Let's personalize your placement preparation journey</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          {/* Basic Info */}
          <div className="form-section">
            <h3><Target size={20} /> Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label>College/University *</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  required
                  placeholder="Your college name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Degree *</label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select degree</option>
                  {degrees.map(degree => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Current Year *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Branch/Specialization *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Target Placement Year</label>
                <select
                  name="placementYear"
                  value={formData.placementYear}
                  onChange={handleInputChange}
                >
                  <option value="">Select year</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="form-section">
            <h3><Code size={20} /> Tech Stack & Skills</h3>
            <p>Select technologies you know or want to learn:</p>
            
            <div className="selection-grid">
              {techStacks.map(tech => (
                <label
                  key={tech.id}
                  className={`selection-item ${formData.techStack.includes(tech.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.techStack.includes(tech.id)}
                    onChange={() => handleArrayToggle('techStack', tech.id, 'techStack')}
                  />
                  <span className="tech-icon">{tech.icon}</span>
                  <span>{tech.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Career Goals */}
          <div className="form-section">
            <h3><Rocket size={20} /> Career Goals</h3>
            <p>What roles are you targeting?</p>
            
            <div className="selection-grid">
              {careerGoals.map(goal => (
                <label
                  key={goal.id}
                  className={`selection-item ${formData.careerGoals.includes(goal.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.careerGoals.includes(goal.id)}
                    onChange={() => handleArrayToggle('careerGoals', goal.id, 'careerGoals')}
                  />
                  <span className="goal-icon">{goal.icon}</span>
                  <span>{goal.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary onboarding-submit">
            <Rocket size={20} />
            Start My Placement Journey
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingModal;
