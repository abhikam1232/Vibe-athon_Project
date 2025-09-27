// Skill Shala - Personal Study Companion
// Main JavaScript functionality

class SkillShala {
    constructor() {
        this.userData = this.loadUserData();
        this.goals = this.loadGoals();
        this.achievements = this.loadAchievements();
        this.notifications = this.loadNotifications();
        this.recommendations = this.generateRecommendations();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkOnboarding();
        this.updateUI();
        this.startNotificationSystem();
        
        // If no user data, ensure we're in onboarding mode
        if (!this.userData.name) {
            // Hide all main sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            // Show onboarding modal
            document.getElementById('onboarding-modal').style.display = 'flex';
        } else {
            // Show dashboard by default for logged in users
            this.showSection('dashboard');
        }
    }

    // Data Management
    loadUserData() {
        return JSON.parse(localStorage.getItem('skillshala_user') || '{}');
    }

    saveUserData() {
        localStorage.setItem('skillshala_user', JSON.stringify(this.userData));
    }

    loadGoals() {
        return JSON.parse(localStorage.getItem('skillshala_goals') || '[]');
    }

    saveGoals() {
        localStorage.setItem('skillshala_goals', JSON.stringify(this.goals));
    }

    loadAchievements() {
        return JSON.parse(localStorage.getItem('skillshala_achievements') || '[]');
    }

    saveAchievements() {
        localStorage.setItem('skillshala_achievements', JSON.stringify(this.achievements));
    }

    loadNotifications() {
        return JSON.parse(localStorage.getItem('skillshala_notifications') || '[]');
    }

    saveNotifications() {
        localStorage.setItem('skillshala_notifications', JSON.stringify(this.notifications));
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Onboarding form
        const onboardingForm = document.getElementById('onboarding-form');
        if (onboardingForm) {
            onboardingForm.addEventListener('submit', (e) => this.handleOnboarding(e));
        }

        // Goal form
        const goalForm = document.getElementById('goal-form');
        if (goalForm) {
            goalForm.addEventListener('submit', (e) => this.handleGoalCreation(e));
        }

        // Notification bell
        const notificationBell = document.getElementById('notification-bell');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => this.toggleNotifications());
        }

        // Close notifications
        const closeNotifications = document.getElementById('close-notifications');
        if (closeNotifications) {
            closeNotifications.addEventListener('click', () => this.closeNotifications());
        }

        // Recommendation filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterRecommendations(e.target.dataset.filter));
        });
    }

    // Onboarding
    checkOnboarding() {
        if (!this.userData.name) {
            document.getElementById('onboarding-modal').style.display = 'flex';
        } else {
            document.getElementById('onboarding-modal').style.display = 'none';
        }
    }

    handleOnboarding(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.userData = {
            name: formData.get('name'),
            grade: formData.get('grade'),
            subjects: formData.getAll('subjects'),
            joinDate: new Date().toISOString(),
            points: 0,
            streak: 0,
            lastActive: new Date().toISOString()
        };

        this.saveUserData();
        document.getElementById('onboarding-modal').style.display = 'none';
        this.updateUI();
        this.populateSubjectDropdown();
        this.showWelcomeMessage();
        
        // Show dashboard after successful onboarding
        this.showSection('dashboard');
    }

    // UI Updates
    updateUI() {
        if (this.userData.name) {
            document.getElementById('user-name').textContent = `Welcome, ${this.userData.name}!`;
            document.getElementById('dashboard-name').textContent = this.userData.name;
            document.getElementById('total-points').textContent = this.userData.points || 0;
            document.getElementById('streak-count').textContent = this.userData.streak || 0;
            
            // Show floating logout button
            document.getElementById('floating-logout').style.display = 'flex';
            
            // Hide create account button
            document.getElementById('create-account-btn').style.display = 'none';
        } else {
            // Hide floating logout button
            document.getElementById('floating-logout').style.display = 'none';
            
            // Show create account button
            document.getElementById('create-account-btn').style.display = 'inline-flex';
            
            // Update welcome message for no user
            document.getElementById('user-name').textContent = 'Welcome to Skill Shala!';
            document.getElementById('dashboard-name').textContent = 'New User';
        }

        this.updateDashboardStats();
        this.renderGoals();
        this.renderRecommendations();
        this.renderBadges();
        this.renderStreakCalendar();
        this.updateNotificationCount();
    }

    updateDashboardStats() {
        const today = new Date().toDateString();
        const todayGoals = this.goals.filter(goal => 
            new Date(goal.createdAt).toDateString() === today
        );
        const completedGoals = todayGoals.filter(goal => goal.completed);

        document.getElementById('goals-completed').textContent = completedGoals.length;
        document.getElementById('study-time').textContent = this.calculateStudyTime();
        document.getElementById('badges-earned').textContent = this.achievements.length;
        document.getElementById('current-streak').textContent = this.userData.streak || 0;
    }

    // Goals Management
    populateSubjectDropdown() {
        const dropdown = document.getElementById('goal-subject');
        if (dropdown && this.userData.subjects) {
            dropdown.innerHTML = '<option value="">Select subject</option>';
            this.userData.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject.charAt(0).toUpperCase() + subject.slice(1);
                dropdown.appendChild(option);
            });
        }
    }

    handleGoalCreation(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const goal = {
            id: Date.now(),
            type: formData.get('type'),
            target: parseInt(formData.get('target')),
            subject: formData.get('subject'),
            progress: 0,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.goals.push(goal);
        this.saveGoals();
        this.renderGoals();
        this.updateDashboardStats();
        e.target.reset();
        this.showToast('Goal created successfully!', 'success');
    }

    renderGoals() {
        const goalsList = document.getElementById('goals-list');
        const goalsPreview = document.getElementById('today-goals-preview');
        
        if (!goalsList) return;

        const today = new Date().toDateString();
        const todayGoals = this.goals.filter(goal => 
            new Date(goal.createdAt).toDateString() === today
        );

        goalsList.innerHTML = '';
        
        if (todayGoals.length === 0) {
            goalsList.innerHTML = '<p class="text-center">No goals set for today. Create your first goal!</p>';
            if (goalsPreview) goalsPreview.innerHTML = '<p>No goals set for today</p>';
            return;
        }

        todayGoals.forEach(goal => {
            const goalElement = this.createGoalElement(goal);
            goalsList.appendChild(goalElement);
        });

        // Update preview
        if (goalsPreview) {
            goalsPreview.innerHTML = '';
            todayGoals.slice(0, 3).forEach(goal => {
                const preview = document.createElement('div');
                preview.className = 'goal-preview-item';
                preview.innerHTML = `
                    <span>${goal.type}: ${goal.progress}/${goal.target} (${goal.subject})</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(goal.progress / goal.target) * 100}%"></div>
                    </div>
                `;
                goalsPreview.appendChild(preview);
            });
        }
    }

    createGoalElement(goal) {
        const div = document.createElement('div');
        div.className = `goal-item ${goal.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="goal-info">
                <h4>${goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} - ${goal.subject}</h4>
                <p>Target: ${goal.target} | Progress: ${goal.progress}/${goal.target}</p>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(goal.progress / goal.target) * 100}%"></div>
                </div>
                <span>${Math.round((goal.progress / goal.target) * 100)}%</span>
            </div>
            <div class="goal-actions">
                ${!goal.completed ? `<button class="complete-btn" onclick="skillShala.updateGoalProgress(${goal.id})">
                    <i class="fas fa-plus"></i>
                </button>` : ''}
                <button class="delete-btn" onclick="skillShala.deleteGoal(${goal.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return div;
    }

    updateGoalProgress(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal && !goal.completed) {
            goal.progress++;
            if (goal.progress >= goal.target) {
                goal.completed = true;
                this.awardPoints(10);
                this.checkForBadges();
                this.showToast('Goal completed! +10 points', 'success');
            }
            this.saveGoals();
            this.renderGoals();
            this.updateDashboardStats();
        }
    }

    deleteGoal(goalId) {
        this.goals = this.goals.filter(g => g.id !== goalId);
        this.saveGoals();
        this.renderGoals();
        this.updateDashboardStats();
        this.showToast('Goal deleted', 'warning');
    }

    // Recommendations System
    generateRecommendations() {
        const baseRecommendations = [
            {
                id: 1,
                title: "Introduction to Algebra",
                description: "Master the basics of algebraic expressions and equations",
                type: "videos",
                subject: "mathematics",
                difficulty: "beginner",
                duration: "45 min",
                points: 15
            },
            {
                id: 2,
                title: "Cell Biology Fundamentals",
                description: "Explore the structure and function of cells",
                type: "articles",
                subject: "biology",
                difficulty: "intermediate",
                duration: "30 min",
                points: 12
            },
            {
                id: 3,
                title: "Grammar Practice Quiz",
                description: "Test your knowledge of English grammar rules",
                type: "quizzes",
                subject: "english",
                difficulty: "beginner",
                duration: "20 min",
                points: 10
            },
            {
                id: 4,
                title: "World War II Timeline",
                description: "Interactive timeline of major WWII events",
                type: "practice",
                subject: "history",
                difficulty: "intermediate",
                duration: "35 min",
                points: 18
            },
            {
                id: 5,
                title: "Physics Problem Solving",
                description: "Practice solving motion and force problems",
                type: "practice",
                subject: "physics",
                difficulty: "advanced",
                duration: "60 min",
                points: 25
            }
        ];

        // Filter based on user subjects
        if (this.userData.subjects && this.userData.subjects.length > 0) {
            return baseRecommendations.filter(rec => 
                this.userData.subjects.includes(rec.subject)
            );
        }

        return baseRecommendations;
    }

    renderRecommendations() {
        const grid = document.getElementById('recommendations-grid');
        if (!grid) return;

        grid.innerHTML = '';
        this.recommendations.forEach(rec => {
            const card = this.createRecommendationCard(rec);
            grid.appendChild(card);
        });
    }

    createRecommendationCard(rec) {
        const div = document.createElement('div');
        div.className = 'recommendation-card';
        div.dataset.type = rec.type;
        div.innerHTML = `
            <div class="recommendation-header">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
            <div class="recommendation-content">
                <div class="recommendation-meta">
                    <span><i class="fas fa-clock"></i> ${rec.duration}</span>
                    <span><i class="fas fa-star"></i> ${rec.points} pts</span>
                </div>
                <div class="recommendation-actions">
                    <button class="start-btn" onclick="skillShala.startRecommendation(${rec.id})">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button class="save-btn" onclick="skillShala.saveRecommendation(${rec.id})">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                </div>
            </div>
        `;
        return div;
    }

    filterRecommendations(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        const cards = document.querySelectorAll('.recommendation-card');
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.type === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    startRecommendation(recId) {
        const rec = this.recommendations.find(r => r.id === recId);
        if (rec) {
            this.awardPoints(rec.points);
            this.addStudyTime(parseInt(rec.duration));
            this.showToast(`Started: ${rec.title}. +${rec.points} points!`, 'success');
            this.checkForBadges();
        }
    }

    saveRecommendation(recId) {
        this.showToast('Recommendation saved for later!', 'success');
    }

    // Engagement Features
    awardPoints(points) {
        this.userData.points = (this.userData.points || 0) + points;
        this.saveUserData();
        this.updateUI();
    }

    addStudyTime(minutes) {
        this.userData.studyTime = (this.userData.studyTime || 0) + minutes;
        this.saveUserData();
    }

    calculateStudyTime() {
        return this.userData.studyTime || 0;
    }

    checkForBadges() {
        const badges = [
            { id: 'first_goal', name: 'Goal Setter', description: 'Complete your first goal', condition: () => this.goals.some(g => g.completed) },
            { id: 'points_100', name: 'Century Club', description: 'Earn 100 points', condition: () => (this.userData.points || 0) >= 100 },
            { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', condition: () => (this.userData.streak || 0) >= 7 },
            { id: 'study_time_300', name: 'Study Master', description: 'Study for 5 hours total', condition: () => (this.userData.studyTime || 0) >= 300 }
        ];

        badges.forEach(badge => {
            if (!this.achievements.find(a => a.id === badge.id) && badge.condition()) {
                this.achievements.push({
                    ...badge,
                    earnedAt: new Date().toISOString()
                });
                this.saveAchievements();
                this.showToast(`Badge earned: ${badge.name}!`, 'success');
            }
        });
    }

    renderBadges() {
        const container = document.getElementById('badges-container');
        if (!container) return;

        const allBadges = [
            { id: 'first_goal', name: 'Goal Setter', description: 'Complete your first goal', icon: 'fa-target' },
            { id: 'points_100', name: 'Century Club', description: 'Earn 100 points', icon: 'fa-star' },
            { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', icon: 'fa-fire' },
            { id: 'study_time_300', name: 'Study Master', description: 'Study for 5 hours total', icon: 'fa-clock' }
        ];

        container.innerHTML = '';
        allBadges.forEach(badge => {
            const earned = this.achievements.find(a => a.id === badge.id);
            const div = document.createElement('div');
            div.className = `badge ${earned ? '' : 'locked'}`;
            div.innerHTML = `
                <i class="fas ${badge.icon}"></i>
                <h4>${badge.name}</h4>
                <p>${badge.description}</p>
            `;
            container.appendChild(div);
        });
    }

    renderStreakCalendar() {
        const calendar = document.getElementById('streak-calendar');
        if (!calendar) return;

        calendar.innerHTML = '';
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.textContent = date.getDate();
            
            if (i === 0) day.classList.add('today');
            if (Math.random() > 0.3) day.classList.add('active'); // Simulate activity
            
            calendar.appendChild(day);
        }
    }

    // Notifications System
    startNotificationSystem() {
        // Check for reminders every minute
        setInterval(() => {
            this.checkReminders();
        }, 60000);

        // Add some sample notifications
        if (this.notifications.length === 0) {
            this.addNotification('Welcome to Skill Shala!', 'Start your learning journey today.', 'info');
        }
    }

    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationCount();
        this.renderNotifications();
    }

    checkReminders() {
        const now = new Date();
        const hour = now.getHours();

        // Daily reminder at 9 AM
        if (hour === 9 && now.getMinutes() === 0) {
            this.addNotification('Daily Reminder', 'Time to start your learning goals for today!', 'reminder');
        }

        // Evening review at 7 PM
        if (hour === 19 && now.getMinutes() === 0) {
            this.addNotification('Evening Review', 'How did your learning go today? Check your progress!', 'reminder');
        }
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.getElementById('notification-count');
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    toggleNotifications() {
        const panel = document.getElementById('notifications-panel');
        panel.classList.toggle('open');
        this.renderNotifications();
    }

    closeNotifications() {
        document.getElementById('notifications-panel').classList.remove('open');
    }

    renderNotifications() {
        const list = document.getElementById('notifications-list');
        if (!list) return;

        list.innerHTML = '';
        
        if (this.notifications.length === 0) {
            list.innerHTML = '<p class="text-center">No notifications yet</p>';
            return;
        }

        this.notifications.forEach(notification => {
            const div = document.createElement('div');
            div.className = `notification-item ${notification.read ? '' : 'unread'}`;
            div.innerHTML = `
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
            `;
            div.addEventListener('click', () => this.markNotificationRead(notification.id));
            list.appendChild(div);
        });
    }

    markNotificationRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationCount();
            this.renderNotifications();
        }
    }

    // Show onboarding modal
    showOnboarding() {
        document.getElementById('onboarding-modal').style.display = 'flex';
    }

    // Logout functionality
    logout() {
        if (confirm('Are you sure you want to switch users? This will clear your current session.')) {
            // Clear all data
            localStorage.removeItem('skillshala_user');
            localStorage.removeItem('skillshala_goals');
            localStorage.removeItem('skillshala_achievements');
            localStorage.removeItem('skillshala_notifications');
            
            // Reset the app
            this.userData = {};
            this.goals = [];
            this.achievements = [];
            this.notifications = [];
            
            // Show onboarding again
            document.getElementById('onboarding-modal').style.display = 'flex';
            
            // Reset UI
            this.updateUI();
            
            // Hide main sections until user completes onboarding
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            this.showToast('Successfully logged out! You can now create a new account.', 'success');
        }
    }

    // Utility Functions
    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`[href="#${sectionId}"]`);
        
        if (targetSection) targetSection.classList.add('active');
        if (targetLink) targetLink.classList.add('active');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showWelcomeMessage() {
        this.showToast(`Welcome to Skill Shala, ${this.userData.name}!`, 'success');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return date.toLocaleDateString();
    }
}

// Global functions for HTML onclick events
window.showSection = function(sectionId) {
    skillShala.showSection(sectionId);
};

// Initialize the application
let skillShala;
document.addEventListener('DOMContentLoaded', () => {
    skillShala = new SkillShala();
});