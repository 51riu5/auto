// Advanced Game Features System
class GameFeatures {
    constructor() {
        this.achievements = new AchievementSystem();
        this.soundManager = new SoundManager();
        this.analytics = new GameAnalytics();
        this.weather = new WeatherSystem();
        this.timeManager = new TimeManager();
        this.tutorialSystem = new TutorialSystem();
        this.leaderboard = new LeaderboardSystem();
        this.socialFeatures = new SocialFeatures();
        this.reputationSystem = new ReputationSystem();
        this.eventSystem = new EventSystem();
        
        this.initializeFeatures();
    }
    
    initializeFeatures() {
        this.setupKeyboardShortcuts();
        this.setupVoiceCommands();
        this.setupGestureControls();
        this.setupOfflineMode();
        this.setupPWA();
        this.loadPlayerProfile();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Quick negotiation responses
            if (e.key === '1') this.quickResponse('polite');
            if (e.key === '2') this.quickResponse('assertive');
            if (e.key === '3') this.quickResponse('cultural');
            if (e.key === '4') this.quickResponse('walk_away');
            
            // Game controls
            if (e.key === 'h') this.showHint();
            if (e.key === 's') this.soundManager.toggle();
            if (e.key === 'r') this.resetNegotiation();
            if (e.key === 't') this.tutorialSystem.restartTutorial();
            if (e.key === 'Escape') this.showPauseMenu();
        });
    }
    
    setupVoiceCommands() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-IN';
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };
        }
    }
    
    processVoiceCommand(command) {
        // Convert voice to text input
        if (window.autoGame && window.autoGame.gameState === 'playing') {
            document.getElementById('player-input').value = command;
            window.autoGame.handlePlayerInput();
        }
    }
    
    quickResponse(type) {
        const responses = {
            polite: "Please uncle, can you give me a good rate?",
            assertive: "That price is too high for this distance.",
            cultural: "Chettan, I'm a local person from Kerala.",
            walk_away: "This is too expensive, I'll take another auto."
        };
        
        if (window.autoGame && responses[type]) {
            document.getElementById('player-input').value = responses[type];
            window.autoGame.handlePlayerInput();
        }
    }
}

// Achievement System
class AchievementSystem {
    constructor() {
        this.achievements = {
            // Negotiation Achievements
            "first_negotiation": { name: "First Ride", description: "Complete your first negotiation", icon: "🛺", unlocked: false },
            "bargain_master": { name: "Bargain Master", description: "Get 50% off the initial price", icon: "💰", unlocked: false },
            "cultural_ambassador": { name: "Cultural Ambassador", description: "Use 10 Malayalam words in negotiations", icon: "🇮🇳", unlocked: false },
            "sweet_talker": { name: "Sweet Talker", description: "Make the driver happy 5 times", icon: "😊", unlocked: false },
            "tough_negotiator": { name: "Tough Negotiator", description: "Complete airport negotiation under fair price", icon: "✈️", unlocked: false },
            
            // Special Achievements
            "uncle_friend": { name: "Uncle's Friend", description: "Get family discount from Uncle Ravi", icon: "👨‍🦳", unlocked: false },
            "festival_expert": { name: "Festival Expert", description: "Negotiate during Onam festival", icon: "🎊", unlocked: false },
            "monsoon_rider": { name: "Monsoon Rider", description: "Take auto during heavy rain", icon: "🌧️", unlocked: false },
            "early_bird": { name: "Early Bird", description: "Negotiate at 6 AM", icon: "🌅", unlocked: false },
            "night_owl": { name: "Night Owl", description: "Negotiate after midnight", icon: "🌙", unlocked: false },
            
            // Expert Achievements
            "kerala_expert": { name: "Kerala Expert", description: "Visit all 5 locations", icon: "🏞️", unlocked: false },
            "negotiation_ninja": { name: "Negotiation Ninja", description: "Win 50 negotiations", icon: "🥷", unlocked: false },
            "culture_guru": { name: "Culture Guru", description: "Get maximum cultural points", icon: "🎭", unlocked: false },
            "auto_whisperer": { name: "Auto Whisperer", description: "Make angry driver happy", icon: "🤝", unlocked: false },
            "legend": { name: "Kerala Legend", description: "Unlock all other achievements", icon: "👑", unlocked: false }
        };
        
        this.loadAchievements();
    }
    
    checkAchievement(id, condition = true) {
        if (condition && this.achievements[id] && !this.achievements[id].unlocked) {
            this.unlockAchievement(id);
        }
    }
    
    unlockAchievement(id) {
        if (this.achievements[id]) {
            this.achievements[id].unlocked = true;
            this.saveAchievements();
            this.showAchievementNotification(this.achievements[id]);
            
            // Check for legend achievement
            const totalAchievements = Object.keys(this.achievements).length - 1; // Exclude legend itself
            const unlockedAchievements = Object.values(this.achievements).filter(a => a.unlocked).length;
            if (unlockedAchievements >= totalAchievements) {
                this.unlockAchievement('legend');
            }
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
        
        // Play achievement sound
        if (window.gameFeatures) {
            window.gameFeatures.soundManager.play('achievement');
        }
    }
    
    saveAchievements() {
        localStorage.setItem('autoNegotiator_achievements', JSON.stringify(this.achievements));
    }
    
    loadAchievements() {
        const saved = localStorage.getItem('autoNegotiator_achievements');
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            Object.keys(savedAchievements).forEach(key => {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = savedAchievements[key].unlocked;
                }
            });
        }
    }
}

// Sound Manager
class SoundManager {
    constructor() {
        this.enabled = localStorage.getItem('autoNegotiator_soundEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('autoNegotiator_volume') || '0.7');
        this.sounds = {};
        this.bgMusic = null;
        
        this.loadSounds();
    }
    
    loadSounds() {
        // Generate sounds using Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create different sound types
        this.createSound('click', 800, 0.1, 'sine');
        this.createSound('success', [523, 659, 784], 0.3, 'sine');
        this.createSound('achievement', [440, 554, 659, 880], 0.4, 'sine');
        this.createSound('error', 200, 0.2, 'sawtooth');
        this.createSound('notification', 1000, 0.15, 'triangle');
        this.createSound('price_drop', [880, 660, 440], 0.2, 'sine');
        this.createSound('typing', 1200, 0.05, 'square');
        
        // Background music (simple ambient)
        this.createAmbientMusic();
    }
    
    createSound(name, frequency, duration, type = 'sine') {
        this.sounds[name] = { frequency, duration, type };
    }
    
    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
        const sound = this.sounds[soundName];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (Array.isArray(sound.frequency)) {
            // Play sequence of notes
            sound.frequency.forEach((freq, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.15);
                osc.type = sound.type;
                
                gain.gain.setValueAtTime(0, this.audioContext.currentTime + index * 0.15);
                gain.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + index * 0.15 + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + index * 0.15 + 0.1);
                
                osc.start(this.audioContext.currentTime + index * 0.15);
                osc.stop(this.audioContext.currentTime + index * 0.15 + 0.1);
            });
        } else {
            oscillator.frequency.setValueAtTime(sound.frequency, this.audioContext.currentTime);
            oscillator.type = sound.type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + sound.duration);
        }
    }
    
    createAmbientMusic() {
        // Simple ambient background music
        if (this.bgMusic) return;
        
        const playAmbient = () => {
            if (!this.enabled) return;
            
            const frequencies = [220, 330, 440, 550]; // A3, E4, A4, C#5
            const duration = 4;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    osc.type = 'sine';
                    
                    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 1);
                    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
                    
                    osc.start(this.audioContext.currentTime);
                    osc.stop(this.audioContext.currentTime + duration);
                }, index * 1000);
            });
            
            setTimeout(playAmbient, 20000); // Repeat every 20 seconds
        };
        
        // Start ambient music after 2 seconds
        setTimeout(playAmbient, 2000);
    }
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('autoNegotiator_soundEnabled', this.enabled);
        
        // Update UI
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) {
            soundBtn.textContent = this.enabled ? '🔊' : '🔇';
            soundBtn.title = this.enabled ? 'Mute Sounds' : 'Enable Sounds';
        }
        
        this.play('click');
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('autoNegotiator_volume', this.volume);
    }
}

// Analytics System
class GameAnalytics {
    constructor() {
        this.stats = {
            totalNegotiations: 0,
            successfulNegotiations: 0,
            totalSavings: 0,
            averageDiscount: 0,
            favoriteLocation: '',
            longestNegotiation: 0,
            quickestNegotiation: Infinity,
            malayalamWordsUsed: 0,
            culturalPointsEarned: 0,
            achievementsUnlocked: 0,
            timeSpentPlaying: 0,
            sessionsPlayed: 0
        };
        
        this.sessionStart = Date.now();
        this.loadStats();
    }
    
    recordNegotiation(data) {
        this.stats.totalNegotiations++;
        
        if (data.success) {
            this.stats.successfulNegotiations++;
            this.stats.totalSavings += data.savings;
            this.stats.averageDiscount = this.stats.totalSavings / this.stats.successfulNegotiations;
        }
        
        this.stats.longestNegotiation = Math.max(this.stats.longestNegotiation, data.rounds);
        this.stats.quickestNegotiation = Math.min(this.stats.quickestNegotiation, data.rounds);
        
        this.stats.malayalamWordsUsed += data.malayalamWordsUsed || 0;
        this.stats.culturalPointsEarned += data.culturalPoints || 0;
        
        this.saveStats();
    }
    
    recordAchievement() {
        this.stats.achievementsUnlocked++;
        this.saveStats();
    }
    
    getSuccessRate() {
        return this.stats.totalNegotiations > 0 ? 
            (this.stats.successfulNegotiations / this.stats.totalNegotiations * 100).toFixed(1) : 0;
    }
    
    saveStats() {
        this.stats.timeSpentPlaying += Date.now() - this.sessionStart;
        this.sessionStart = Date.now();
        localStorage.setItem('autoNegotiator_stats', JSON.stringify(this.stats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('autoNegotiator_stats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
    }
}

// Weather System
class WeatherSystem {
    constructor() {
        this.currentWeather = this.generateWeather();
        this.weatherEffects = {
            'sunny': { priceMultiplier: 1.0, mood: 1.0, description: "Clear sunny day" },
            'cloudy': { priceMultiplier: 1.0, mood: 0.9, description: "Overcast sky" },
            'rainy': { priceMultiplier: 1.3, mood: 0.7, description: "Heavy monsoon rain" },
            'stormy': { priceMultiplier: 1.5, mood: 0.5, description: "Thunderstorm warning" },
            'festival': { priceMultiplier: 1.4, mood: 1.2, description: "Festival celebrations" }
        };
        
        this.updateWeatherDisplay();
        
        // Change weather every 5 minutes
        setInterval(() => {
            this.currentWeather = this.generateWeather();
            this.updateWeatherDisplay();
        }, 300000);
    }
    
    generateWeather() {
        const weathers = ['sunny', 'cloudy', 'rainy', 'stormy'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // Probability weights
        
        // Special events
        const now = new Date();
        if (this.isOnamSeason(now)) {
            return Math.random() < 0.3 ? 'festival' : 'sunny';
        }
        
        let random = Math.random();
        for (let i = 0; i < weathers.length; i++) {
            random -= weights[i];
            if (random <= 0) return weathers[i];
        }
        
        return 'sunny';
    }
    
    isOnamSeason(date) {
        // Onam typically falls in August-September
        const month = date.getMonth();
        return month === 7 || month === 8; // August or September
    }
    
    updateWeatherDisplay() {
        const weatherElement = document.getElementById('weather-display');
        if (weatherElement) {
            const effect = this.weatherEffects[this.currentWeather];
            const icons = {
                'sunny': '☀️',
                'cloudy': '☁️', 
                'rainy': '🌧️',
                'stormy': '⛈️',
                'festival': '🎊'
            };
            
            weatherElement.innerHTML = `
                <span class="weather-icon">${icons[this.currentWeather]}</span>
                <span class="weather-desc">${effect.description}</span>
            `;
        }
    }
    
    getWeatherEffect() {
        return this.weatherEffects[this.currentWeather];
    }
}

// Time Management System
class TimeManager {
    constructor() {
        this.updateTime();
        setInterval(() => this.updateTime(), 60000); // Update every minute
    }
    
    updateTime() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        
        const timeElement = document.getElementById('game-time');
        if (timeElement) {
            timeElement.textContent = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }
        
        // Time-based effects
        this.currentTimeEffect = this.getTimeEffect(hour);
    }
    
    getTimeEffect(hour) {
        if (hour >= 6 && hour < 10) {
            return { period: 'morning', multiplier: 1.1, description: 'Morning rush hour' };
        } else if (hour >= 10 && hour < 16) {
            return { period: 'day', multiplier: 1.0, description: 'Regular hours' };
        } else if (hour >= 16 && hour < 20) {
            return { period: 'evening', multiplier: 1.2, description: 'Evening rush hour' };
        } else if (hour >= 20 && hour < 24) {
            return { period: 'night', multiplier: 1.15, description: 'Night service' };
        } else {
            return { period: 'late_night', multiplier: 1.3, description: 'Late night premium' };
        }
    }
}

// Tutorial System
class TutorialSystem {
    constructor() {
        this.currentStep = 0;
        this.tutorialSteps = [
            {
                target: '.location-select',
                title: 'Choose Your Location',
                content: 'Select a location to start your negotiation. Each location has different difficulty levels!',
                position: 'bottom'
            },
            {
                target: '.game-controls',
                title: 'Game Controls',
                content: 'Use these controls for sound, achievements, leaderboard, and tutorial access. Click 🎓 anytime to restart this tutorial!',
                position: 'top'
            },
            {
                target: '#weather-display',
                title: 'Dynamic Environment',
                content: 'Weather affects pricing! Rain means higher rates, while sunny days are better for negotiation.',
                position: 'bottom'
            },
            {
                target: '#reputation-display',
                title: 'Your Reputation',
                content: 'Build your reputation as a skilled negotiator. Click here to see detailed statistics!',
                position: 'bottom'
            },
            {
                target: 'body',
                title: 'Ready to Negotiate!',
                content: 'You\'re all set! Select a location to start your first negotiation. Use "Uncle" or "Chettan" for cultural points, and remember - be polite but persistent!',
                position: 'bottom'
            }
        ];
        
        this.checkFirstTime();
    }
    
    checkFirstTime() {
        const hasPlayedBefore = localStorage.getItem('autoNegotiator_hasPlayed');
        if (!hasPlayedBefore) {
            setTimeout(() => this.startTutorial(), 1000);
        }
    }
    
    startTutorial() {
        this.currentStep = 0;
        this.showTutorialStep();
    }
    
    showTutorialStep() {
        console.log(`Tutorial: Showing step ${this.currentStep + 1} of ${this.tutorialSteps.length}`);
        
        if (this.currentStep >= this.tutorialSteps.length) {
            this.endTutorial();
            return;
        }
        
        const step = this.tutorialSteps[this.currentStep];
        console.log(`Tutorial: Looking for target "${step.target}"`);
        const target = document.querySelector(step.target);
        
        if (!target) {
            console.warn(`Tutorial: Target "${step.target}" not found, skipping step`);
            this.currentStep++;
            setTimeout(() => this.showTutorialStep(), 100);
            return;
        }
        
        console.log(`Tutorial: Creating overlay for step "${step.title}"`);
        this.createTutorialOverlay(target, step);
    }
    
    createTutorialOverlay(target, step) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = `
            <div class="tutorial-spotlight"></div>
            <div class="tutorial-popup ${step.position}">
                <div class="tutorial-content">
                    <h3>${step.title}</h3>
                    <p>${step.content}</p>
                    <div class="tutorial-buttons">
                        <button id="tutorial-skip-btn">Skip</button>
                        <button id="tutorial-next-btn" class="primary">Next</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners with proper context binding
        const skipBtn = overlay.querySelector('#tutorial-skip-btn');
        const nextBtn = overlay.querySelector('#tutorial-next-btn');
        
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Tutorial: Skip button clicked');
                this.skipTutorial();
            });
        } else {
            console.error('Tutorial: Skip button not found');
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Tutorial: Next button clicked');
                this.nextStep();
            });
        } else {
            console.error('Tutorial: Next button not found');
        }
        
        // Position spotlight on target
        const rect = target.getBoundingClientRect();
        const spotlight = overlay.querySelector('.tutorial-spotlight');
        spotlight.style.left = rect.left + 'px';
        spotlight.style.top = rect.top + 'px';
        spotlight.style.width = rect.width + 'px';
        spotlight.style.height = rect.height + 'px';
        
        // Position popup
        const popup = overlay.querySelector('.tutorial-popup');
        this.positionPopup(popup, rect, step.position);
    }
    
    positionPopup(popup, targetRect, position) {
        const popupRect = popup.getBoundingClientRect();
        
        switch (position) {
            case 'top':
                popup.style.left = targetRect.left + (targetRect.width - popupRect.width) / 2 + 'px';
                popup.style.top = targetRect.top - popupRect.height - 20 + 'px';
                break;
            case 'bottom':
                popup.style.left = targetRect.left + (targetRect.width - popupRect.width) / 2 + 'px';
                popup.style.top = targetRect.bottom + 20 + 'px';
                break;
            case 'left':
                popup.style.left = targetRect.left - popupRect.width - 20 + 'px';
                popup.style.top = targetRect.top + (targetRect.height - popupRect.height) / 2 + 'px';
                break;
            case 'right':
                popup.style.left = targetRect.right + 20 + 'px';
                popup.style.top = targetRect.top + (targetRect.height - popupRect.height) / 2 + 'px';
                break;
        }
    }
    
    nextStep() {
        console.log('Tutorial: Moving to next step');
        this.closeTutorialOverlay();
        this.currentStep++;
        setTimeout(() => this.showTutorialStep(), 500);
        
        // Play sound feedback
        if (window.gameFeatures && window.gameFeatures.soundManager) {
            window.gameFeatures.soundManager.play('click');
        }
    }
    
    skipTutorial() {
        console.log('Tutorial: Skipping tutorial');
        this.closeTutorialOverlay();
        this.endTutorial();
        
        // Play sound feedback
        if (window.gameFeatures && window.gameFeatures.soundManager) {
            window.gameFeatures.soundManager.play('notification');
        }
    }
    
    closeTutorialOverlay() {
        const overlay = document.querySelector('.tutorial-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    endTutorial() {
        console.log('Tutorial: Tutorial completed');
        localStorage.setItem('autoNegotiator_hasPlayed', 'true');
        if (window.gameFeatures && window.gameFeatures.soundManager) {
            window.gameFeatures.soundManager.play('success');
        }
        
        // Show completion message
        if (window.gameFeatures && window.gameFeatures.socialFeatures) {
            window.gameFeatures.socialFeatures.showToast('🎓 Tutorial completed! You\'re ready to negotiate!');
        }
    }
    
    // Manual tutorial restart function
    restartTutorial() {
        console.log('Tutorial: Manually restarting tutorial');
        this.currentStep = 0;
        this.closeTutorialOverlay(); // Close any existing overlay
        setTimeout(() => this.startTutorial(), 500);
    }
}

// Leaderboard System
class LeaderboardSystem {
    constructor() {
        this.leaderboard = this.loadLeaderboard();
    }
    
    submitScore(playerName, score, location, savings) {
        const entry = {
            name: playerName || 'Anonymous',
            score: score,
            location: location,
            savings: savings,
            timestamp: Date.now()
        };
        
        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 100); // Keep top 100
        
        this.saveLeaderboard();
        return this.getPlayerRank(score);
    }
    
    getPlayerRank(score) {
        return this.leaderboard.findIndex(entry => entry.score <= score) + 1;
    }
    
    getTopScores(limit = 10) {
        return this.leaderboard.slice(0, limit);
    }
    
    saveLeaderboard() {
        localStorage.setItem('autoNegotiator_leaderboard', JSON.stringify(this.leaderboard));
    }
    
    loadLeaderboard() {
        const saved = localStorage.getItem('autoNegotiator_leaderboard');
        return saved ? JSON.parse(saved) : [];
    }
}

// Social Features
class SocialFeatures {
    constructor() {
        this.setupShareButtons();
    }
    
    shareAchievement(achievement) {
        if (navigator.share) {
            navigator.share({
                title: 'Auto-Rickshaw Negotiation Simulator',
                text: `I just unlocked "${achievement.name}" in the Kerala Auto Negotiation game! ${achievement.icon}`,
                url: window.location.href
            });
        } else {
            this.copyToClipboard(`I just unlocked "${achievement.name}" in the Kerala Auto Negotiation game! Play at ${window.location.href}`);
        }
    }
    
    shareScore(score, location, savings) {
        const message = `I just negotiated a ₹${savings} discount in ${location} on the Kerala Auto Negotiation Simulator! Score: ${score}. Can you beat it?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Auto-Rickshaw Negotiation Challenge',
                text: message,
                url: window.location.href
            });
        } else {
            this.copyToClipboard(message + ` ${window.location.href}`);
        }
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard! Share with your friends!');
        });
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    setupShareButtons() {
        // Add share buttons to achievement notifications
        document.addEventListener('achievement-unlocked', (e) => {
            setTimeout(() => {
                const notification = document.querySelector('.achievement-notification');
                if (notification) {
                    const shareBtn = document.createElement('button');
                    shareBtn.className = 'share-achievement-btn';
                    shareBtn.innerHTML = '📱 Share';
                    shareBtn.onclick = () => this.shareAchievement(e.detail);
                    notification.querySelector('.achievement-content').appendChild(shareBtn);
                }
            }, 1000);
        });
    }
}

// Reputation System
class ReputationSystem {
    constructor() {
        this.reputation = {
            overall: 50, // 0-100 scale
            byLocation: {},
            traits: {
                politeness: 50,
                cultural_awareness: 50,
                negotiation_skill: 50,
                patience: 50,
                humor: 50
            }
        };
        
        this.loadReputation();
    }
    
    updateReputation(location, outcome, traits) {
        // Update overall reputation
        if (outcome.success) {
            this.reputation.overall = Math.min(100, this.reputation.overall + 2);
        } else {
            this.reputation.overall = Math.max(0, this.reputation.overall - 1);
        }
        
        // Update location-specific reputation
        if (!this.reputation.byLocation[location]) {
            this.reputation.byLocation[location] = 50;
        }
        
        if (outcome.success) {
            this.reputation.byLocation[location] = Math.min(100, this.reputation.byLocation[location] + 3);
        } else {
            this.reputation.byLocation[location] = Math.max(0, this.reputation.byLocation[location] - 2);
        }
        
        // Update traits
        Object.keys(traits).forEach(trait => {
            if (this.reputation.traits[trait] !== undefined) {
                const change = traits[trait] > 0 ? 1 : -0.5;
                this.reputation.traits[trait] = Math.max(0, Math.min(100, this.reputation.traits[trait] + change));
            }
        });
        
        this.saveReputation();
    }
    
    getReputationLevel() {
        const score = this.reputation.overall;
        if (score >= 90) return { level: 'Legendary', color: '#FFD700', description: 'Master Negotiator' };
        if (score >= 80) return { level: 'Expert', color: '#9932CC', description: 'Skilled Bargainer' };
        if (score >= 70) return { level: 'Advanced', color: '#4169E1', description: 'Good Negotiator' };
        if (score >= 60) return { level: 'Intermediate', color: '#32CD32', description: 'Learning Fast' };
        if (score >= 40) return { level: 'Beginner', color: '#FFA500', description: 'Getting Started' };
        return { level: 'Novice', color: '#DC143C', description: 'Needs Practice' };
    }
    
    saveReputation() {
        localStorage.setItem('autoNegotiator_reputation', JSON.stringify(this.reputation));
    }
    
    loadReputation() {
        const saved = localStorage.getItem('autoNegotiator_reputation');
        if (saved) {
            this.reputation = { ...this.reputation, ...JSON.parse(saved) };
        }
    }
}

// Event System
class EventSystem {
    constructor() {
        this.activeEvents = [];
        this.eventTypes = {
            'onam_festival': {
                name: 'Onam Festival',
                description: 'Celebrate Onam with special rates!',
                duration: 7 * 24 * 60 * 60 * 1000, // 7 days
                effects: { priceMultiplier: 1.4, culturalBonus: 2 },
                probability: 0.1
            },
            'monsoon_season': {
                name: 'Monsoon Alert',
                description: 'Heavy rains affect auto availability',
                duration: 3 * 24 * 60 * 60 * 1000, // 3 days
                effects: { priceMultiplier: 1.3, moodPenalty: -0.2 },
                probability: 0.15
            },
            'fuel_price_hike': {
                name: 'Fuel Price Increase',
                description: 'Petrol prices have gone up!',
                duration: 2 * 24 * 60 * 60 * 1000, // 2 days
                effects: { priceMultiplier: 1.2, stubbornness: 0.3 },
                probability: 0.2
            }
        };
        
        this.checkForEvents();
        
        // Check for new events every hour
        setInterval(() => this.checkForEvents(), 3600000);
    }
    
    checkForEvents() {
        // Remove expired events
        this.activeEvents = this.activeEvents.filter(event => 
            Date.now() - event.startTime < event.duration
        );
        
        // Check for new events
        Object.keys(this.eventTypes).forEach(eventId => {
            if (!this.activeEvents.find(e => e.id === eventId)) {
                const eventType = this.eventTypes[eventId];
                if (Math.random() < eventType.probability / 24) { // Daily probability
                    this.startEvent(eventId, eventType);
                }
            }
        });
    }
    
    startEvent(eventId, eventType) {
        const event = {
            id: eventId,
            ...eventType,
            startTime: Date.now()
        };
        
        this.activeEvents.push(event);
        this.showEventNotification(event);
    }
    
    showEventNotification(event) {
        const notification = document.createElement('div');
        notification.className = 'event-notification';
        notification.innerHTML = `
            <div class="event-content">
                <div class="event-icon">🎪</div>
                <div class="event-text">
                    <div class="event-title">Special Event!</div>
                    <div class="event-name">${event.name}</div>
                    <div class="event-description">${event.description}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 6000);
    }
    
    getActiveEventEffects() {
        const effects = {
            priceMultiplier: 1,
            culturalBonus: 0,
            moodPenalty: 0,
            stubbornness: 0
        };
        
        this.activeEvents.forEach(event => {
            if (event.effects.priceMultiplier) {
                effects.priceMultiplier *= event.effects.priceMultiplier;
            }
            if (event.effects.culturalBonus) {
                effects.culturalBonus += event.effects.culturalBonus;
            }
            if (event.effects.moodPenalty) {
                effects.moodPenalty += event.effects.moodPenalty;
            }
            if (event.effects.stubbornness) {
                effects.stubbornness += event.effects.stubbornness;
            }
        });
        
        return effects;
    }
}

// Export to global scope
window.GameFeatures = GameFeatures;

// Debug functions for console testing
window.testTutorial = function() {
    console.log('Testing tutorial system...');
    if (window.gameFeatures && window.gameFeatures.tutorialSystem) {
        window.gameFeatures.tutorialSystem.restartTutorial();
        console.log('Tutorial started!');
    } else {
        console.error('Game features or tutorial system not available');
    }
};

window.debugTutorial = function() {
    console.log('Tutorial system debug info:');
    if (window.gameFeatures) {
        console.log('Game features available:', !!window.gameFeatures);
        console.log('Tutorial system available:', !!window.gameFeatures.tutorialSystem);
        if (window.gameFeatures.tutorialSystem) {
            console.log('Current step:', window.gameFeatures.tutorialSystem.currentStep);
            console.log('Total steps:', window.gameFeatures.tutorialSystem.tutorialSteps.length);
        }
    } else {
        console.error('Game features not available');
    }
}; 