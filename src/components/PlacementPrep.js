import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building, Users, Clock, Target } from 'lucide-react';
import './PlacementPrep.css';

const PlacementPrep = () => {
  const companies = [
    { name: 'Google', status: 'upcoming', date: '2024-03-15', type: 'SDE' },
    { name: 'Microsoft', status: 'applied', date: '2024-03-20', type: 'SDE-2' },
    { name: 'Amazon', status: 'interview', date: '2024-03-10', type: 'SDE' },
    { name: 'Meta', status: 'upcoming', date: '2024-04-01', type: 'Frontend' }
  ];

  return (
    <motion.div 
      className="placement-prep-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="placement-header">
          <h1><Briefcase size={32} /> Placement Preparation</h1>
          <p>Track your job applications and interview preparation</p>
        </div>

        <div className="placement-stats">
          <div className="stat-card glass-card">
            <Building size={24} />
            <div>
              <h3>12</h3>
              <p>Companies Applied</p>
            </div>
          </div>
          <div className="stat-card glass-card">
            <Calendar size={24} />
            <div>
              <h3>5</h3>
              <p>Interviews Scheduled</p>
            </div>
          </div>
          <div className="stat-card glass-card">
            <Users size={24} />
            <div>
              <h3>3</h3>
              <p>Offers Received</p>
            </div>
          </div>
        </div>

        <div className="companies-grid">
          {companies.map((company, index) => (
            <div key={index} className={`company-card glass-card ${company.status}`}>
              <div className="company-header">
                <h3>{company.name}</h3>
                <span className={`status-badge ${company.status}`}>
                  {company.status}
                </span>
              </div>
              <div className="company-details">
                <p><Target size={16} /> {company.type}</p>
                <p><Clock size={16} /> {company.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PlacementPrep;
