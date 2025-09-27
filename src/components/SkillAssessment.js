import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Play, Trophy } from 'lucide-react';
import './SkillAssessment.css';

const SkillAssessment = () => {
  const skills = [
    { name: 'JavaScript', level: 85, color: '#f7df1e' },
    { name: 'React', level: 78, color: '#61dafb' },
    { name: 'Python', level: 92, color: '#3776ab' },
    { name: 'Java', level: 70, color: '#ed8b00' },
    { name: 'DSA', level: 65, color: '#667eea' },
    { name: 'System Design', level: 45, color: '#fd79a8' }
  ];

  const assessments = [
    { name: 'JavaScript Fundamentals', duration: '30 min', difficulty: 'Intermediate', points: 25 },
    { name: 'React Components', duration: '45 min', difficulty: 'Advanced', points: 35 },
    { name: 'Data Structures', duration: '60 min', difficulty: 'Advanced', points: 40 },
    { name: 'Algorithm Design', duration: '90 min', difficulty: 'Expert', points: 50 }
  ];

  return (
    <motion.div 
      className="skill-assessment-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="skill-header">
          <h1><Brain size={32} /> Skill Assessment</h1>
          <p>Test your technical skills and track your progress</p>
        </div>

        <div className="skills-overview glass-card">
          <h3>Your Skill Levels</h3>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress"
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="assessments-section">
          <h3><Trophy size={24} /> Available Assessments</h3>
          <div className="assessments-grid">
            {assessments.map((assessment, index) => (
              <div key={index} className="assessment-card glass-card">
                <div className="assessment-header">
                  <h4>{assessment.name}</h4>
                  <span className={`difficulty-badge ${assessment.difficulty.toLowerCase()}`}>
                    {assessment.difficulty}
                  </span>
                </div>
                <div className="assessment-details">
                  <p>Duration: {assessment.duration}</p>
                  <p>Points: {assessment.points}</p>
                </div>
                <button className="btn btn-primary">
                  <Play size={16} />
                  Start Assessment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillAssessment;
