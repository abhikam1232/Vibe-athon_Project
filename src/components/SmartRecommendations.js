import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ExternalLink, 
  Star, 
  Clock, 
  BookOpen, 
  Zap,
  Search,
  Grid,
  List,
  TrendingUp
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { 
  learningResources, 
  getAllResources, 
  filterResourcesByType, 
  getRecommendedResources 
} from '../data/resources';
import './SmartRecommendations.css';

const SmartRecommendations = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showRecommended, setShowRecommended] = useState(true);

  const categories = ['All', ...Object.keys(learningResources)];
  const types = ['All', 'Free', 'Paid'];

  // Get user interests from onboarding data
  const userInterests = useMemo(() => {
    if (!user?.careerGoals && !user?.techStack) return [];
    
    const interests = [];
    
    // Map career goals to categories
    const careerGoalMapping = {
      'ml-engineer': 'AI & Machine Learning',
      'data-scientist': 'Data Science',
      'fullstack': 'Full Stack Development',
      'devops': 'DevOps',
      'frontend': 'Full Stack Development',
      'backend': 'Full Stack Development'
    };
    
    // Map tech stack to categories
    const techStackMapping = {
      'ml': 'AI & Machine Learning',
      'python': 'Data Science',
      'react': 'Full Stack Development',
      'nodejs': 'Full Stack Development',
      'javascript': 'Full Stack Development'
    };
    
    user?.careerGoals?.forEach(goal => {
      if (careerGoalMapping[goal]) {
        interests.push(careerGoalMapping[goal]);
      }
    });
    
    user?.techStack?.forEach(tech => {
      if (techStackMapping[tech]) {
        interests.push(techStackMapping[tech]);
      }
    });
    
    return [...new Set(interests)]; // Remove duplicates
  }, [user]);

  // Filter and search resources
  const filteredResources = useMemo(() => {
    let resources = [];
    
    if (showRecommended && userInterests.length > 0) {
      resources = getRecommendedResources(userInterests);
    } else if (selectedCategory === 'All') {
      resources = getAllResources();
    } else {
      resources = learningResources[selectedCategory] || [];
    }
    
    // Filter by type
    resources = filterResourcesByType(resources, selectedType);
    
    // Filter by search query
    if (searchQuery) {
      resources = resources.filter(resource =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return resources;
  }, [selectedCategory, selectedType, searchQuery, showRecommended, userInterests]);

  const handleResourceClick = (resource) => {
    // Track resource click for analytics
    console.log('Resource clicked:', resource.name);
    window.open(resource.link, '_blank', 'noopener,noreferrer');
  };

  const getTypeColor = (type) => {
    return type === 'Free' ? 'type-free' : 'type-paid';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'level-beginner',
      'Intermediate': 'level-intermediate',
      'Advanced': 'level-advanced',
      'All levels': 'level-all'
    };
    return colors[level] || 'level-default';
  };

  return (
    <motion.div 
      className="smart-recommendations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        {/* Header */}
        <div className="recommendations-header">
          <div className="header-title">
            <BookOpen className="header-icon" size={32} />
            <h1>Smart Learning Recommendations</h1>
          </div>
          <p className="header-description">
            Discover curated learning resources tailored to your career goals and interests
          </p>
          
          {userInterests.length > 0 && (
            <div className="personalized-section">
              <div className="personalized-header">
                <TrendingUp className="personalized-icon" size={20} />
                <span className="personalized-title">Personalized for you:</span>
              </div>
              <div className="interests-tags">
                {userInterests.map((interest, index) => (
                  <span key={index} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="filters-section">
          <div className="filters-top-row">
            {/* Search */}
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="filters-bottom-row">
            {/* Recommended Toggle */}
            {userInterests.length > 0 && (
              <label className="recommended-toggle">
                <input
                  type="checkbox"
                  checked={showRecommended}
                  onChange={(e) => setShowRecommended(e.target.checked)}
                  className="recommended-checkbox"
                />
                <span className="recommended-label">Show Recommended First</span>
              </label>
            )}

            {/* Category Filter */}
            <div className="category-filter">
              <Filter className="filter-icon" size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="type-filter">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`type-filter-btn ${selectedType === type ? 'active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <p>
            Showing <span className="count-number">{filteredResources.length}</span> resources
            {selectedCategory !== 'All' && (
              <span> in <span className="category-name">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Resources Grid/List */}
        <AnimatePresence mode="wait">
          {filteredResources.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BookOpen className="empty-icon" size={64} />
              <h3 className="empty-title">No resources found</h3>
              <p className="empty-description">Try adjusting your filters or search terms</p>
            </motion.div>
          ) : (
            <motion.div 
              className={`resources-container ${viewMode === 'grid' ? 'resources-grid' : 'resources-list'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  className={`resource-card ${viewMode === 'list' ? 'resource-card-list' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="resource-header">
                    <div className="resource-header-content">
                      <h3 className="resource-title">{resource.name}</h3>
                      <div className="resource-badges">
                        <span className={`type-badge ${getTypeColor(resource.type)}`}>
                          {resource.type}
                        </span>
                        {resource.level && (
                          <span className={`level-badge ${getLevelColor(resource.level)}`}>
                            {resource.level}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="provider-name">{resource.provider}</p>
                  </div>

                  <p className="resource-description">{resource.description}</p>

                  <div className="resource-meta">
                    <div className="resource-stats">
                      {resource.rating && (
                        <div className="resource-stat">
                          <Star className="stat-icon rating-icon" size={16} fill="currentColor" />
                          <span>{resource.rating}</span>
                        </div>
                      )}
                      {resource.duration && (
                        <div className="resource-stat">
                          <Clock className="stat-icon duration-icon" size={16} />
                          <span>{resource.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleResourceClick(resource)}
                    className="resource-button"
                  >
                    <span>Go to Resource</span>
                    <ExternalLink size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SmartRecommendations;
