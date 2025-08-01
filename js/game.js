// Auto-Rickshaw Negotiation Simulator - Main Game Logic

class AutoNegotiationGame {
    constructor() {
        this.currentLocation = null;
        this.gameState = 'menu';
        this.negotiationRound = 0;
        this.maxRounds = 8;
        this.driverMood = 'neutral';
        this.currentPrice = 0;
        this.playerScore = 0;
        this.culturalPoints = 0;
        this.negotiationHistory = [];
        this.aiService = new AIService();
        this.advancedDriverAI = null;
        this.isProcessing = false;
        this.apiConfigurationStatus = 'unconfigured';
        this.lastPriceChange = 0;
        this.consecutiveGoodMoves = 0;
        
        this.init();
    }

    init() {
        // Check if required objects are loaded
        if (typeof LOCATIONS === 'undefined') {
            console.error('LOCATIONS not loaded! Check script loading order.');
            setTimeout(() => this.init(), 100); // Retry after 100ms
            return;
        }
        
        // Validate LOCATIONS object
        const locationKeys = Object.keys(LOCATIONS);
        if (locationKeys.length === 0) {
            console.error('LOCATIONS object is empty!');
            return;
        }
        
        // Test that each location has required properties
        let validLocations = 0;
        locationKeys.forEach(key => {
            const loc = LOCATIONS[key];
            if (loc && loc.fairPrice && loc.initialMultiplier && loc.name) {
                validLocations++;
            } else {
                console.error(`Invalid location data for ${key}:`, loc);
            }
        });
        
        if (validLocations === 0) {
            console.error('No valid locations found!');
            alert('Error: Game data failed to load properly. Please refresh the page.');
            return;
        }
        
        console.log(`Game initialized with ${validLocations}/${locationKeys.length} valid locations:`, locationKeys);
        
        this.setupEventListeners();
        this.showScreen('start');
        this.loadVRScene();
        this.showAIConfigModal();
    }

    setupEventListeners() {
        // Location selection
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const locationId = e.target.getAttribute('data-location');
                this.selectLocation(locationId);
            });
        });

        // Start VR
        document.getElementById('start-vr').addEventListener('click', () => {
            // If no location selected, auto-select the first one (Uncle Ravi - tutorial mode)
            if (!this.currentLocation) {
                console.log('No location selected, auto-selecting tutorial mode');
                this.selectLocation('uncle');
                // Add small delay to ensure location is properly set
                setTimeout(() => {
                    this.startGame();
                }, 100);
            } else {
                this.startGame();
            }
        });

        // Text input handling
        const playerInput = document.getElementById('player-input');
        const sendBtn = document.getElementById('send-btn');

        playerInput.addEventListener('input', (e) => {
            sendBtn.disabled = e.target.value.trim().length === 0 || this.isProcessing;
        });

        playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !sendBtn.disabled) {
                this.handlePlayerInput();
            }
        });

        sendBtn.addEventListener('click', () => {
            if (!sendBtn.disabled) {
                this.handlePlayerInput();
            }
        });

        // Suggestion chips
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const text = e.target.getAttribute('data-text');
                playerInput.value = text;
                playerInput.dispatchEvent(new Event('input'));
                playerInput.focus();
            });
        });

        // Modal handling
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideAIConfigModal();
        });

        // Play again
        document.getElementById('play-again').addEventListener('click', () => {
            this.resetGame();
        });
    }

    showAIConfigModal() {
        document.getElementById('ai-config-modal').classList.add('active');
    }

    hideAIConfigModal() {
        document.getElementById('ai-config-modal').classList.remove('active');
    }

    selectLocation(locationId) {
        // Debug logging
        console.log('Selecting location:', locationId);
        console.log('Available locations:', Object.keys(LOCATIONS || {}));
        
        if (!LOCATIONS || !LOCATIONS[locationId]) {
            console.error('Location not found:', locationId);
            alert('Location not available. Please try again.');
            return;
        }

        this.currentLocation = LOCATIONS[locationId];
        console.log('Selected location:', this.currentLocation);
        
        // Update location info
        document.getElementById('location-name').textContent = this.currentLocation.name;
        document.getElementById('difficulty-indicator').textContent = this.currentLocation.difficultyLabel;
        
        // Update VR environment
        this.updateVREnvironment();
        
        // Highlight selected location
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        const selectedBtn = document.querySelector(`[data-location="${locationId}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Initialize pricing immediately
        this.initializePricing();
    }
    
    initializePricing() {
        if (!this.currentLocation) return;
        
        // Set initial price
        this.currentPrice = Math.round(
            this.currentLocation.fairPrice * this.currentLocation.initialMultiplier
        );
        
        console.log('Initialized pricing:', {
            fairPrice: this.currentLocation.fairPrice,
            initialMultiplier: this.currentLocation.initialMultiplier,
            currentPrice: this.currentPrice
        });
        
        // Update price display immediately
        this.updatePriceDisplay();
    }

    startGame() {
        // Double-check location is selected, fallback to uncle if not
        if (!this.currentLocation) {
            console.warn('No location selected in startGame, selecting uncle as fallback');
            this.selectLocation('uncle');
        }
        
        if (!this.currentLocation) {
            alert('Failed to initialize location! Please refresh the page.');
            return;
        }

        this.gameState = 'playing';
        this.negotiationRound = 0;
        this.driverMood = 'neutral';
        
        // Force pricing initialization
        this.initializePricing();
        
        // Debug pricing after initialization
        console.log('After initialization:', {
            currentPrice: this.currentPrice,
            fairPrice: this.currentLocation.fairPrice,
            initialMultiplier: this.currentLocation.initialMultiplier,
            locationName: this.currentLocation.name
        });
        
        // Initialize Advanced Driver AI
        const locationKey = Object.keys(LOCATIONS).find(key => LOCATIONS[key] === this.currentLocation);
        const driverProfile = {
            location: this.currentLocation.name,
            difficulty: this.currentLocation.difficulty,
            personality: this.currentLocation.driverPersonality,
            stubbornness: this.currentLocation.stubbornness,
            greediness: this.currentLocation.greediness
        };
        this.advancedDriverAI = new AdvancedDriverAI(this.currentLocation, driverProfile);
        
        console.log('Game started with price:', this.currentPrice);
        
        // Force UI update
        this.updatePriceDisplay();
        this.showScreen('game');
        
        // Start negotiation
        this.startNegotiation();
    }

    startNegotiation() {
        this.negotiationRound = 1; // Start at round 1, not increment from 0
        
        // Force price display update to ensure prices are visible
        this.updatePriceDisplay();
        
        // Get driver's opening line
        const greeting = this.getDriverPhrase('greetings');
        this.displayDriverDialogue(greeting);
        
        // Add to conversation history
        this.addToConversationHistory('driver', greeting);
        
        // Update negotiation stats
        this.updateNegotiationStats();
        
        console.log(`Starting negotiation - Initial price: ₹${this.currentPrice}, Fair price: ₹${this.currentLocation.fairPrice}`);
        
        // Enable input
        this.enablePlayerInput();
    }

    async handlePlayerInput() {
        const input = document.getElementById('player-input').value.trim();
        if (!input || this.isProcessing) return;

        console.log('Processing player input:', input);
        this.isProcessing = true;
        this.disablePlayerInput();
        
        // Add player message to conversation
        this.addToConversationHistory('player', input);
        
        // Clear input
        document.getElementById('player-input').value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            console.error('Player input processing timed out');
            this.hideTypingIndicator();
            
            // Ensure price is set even during timeout
            if (!this.currentPrice || this.currentPrice === 0) {
                if (this.currentLocation) {
                    this.currentPrice = Math.round(this.currentLocation.fairPrice * this.currentLocation.initialMultiplier);
                    console.log('Set price during timeout:', this.currentPrice);
                }
            }
            
            this.displayDriverDialogue("Sorry, let me think... ₹" + this.currentPrice + " is my final offer.");
            this.addToConversationHistory('driver', "Sorry, let me think... ₹" + this.currentPrice + " is my final offer.");
            
            // Update price display
            this.updatePriceDisplay();
            this.updateNegotiationStats();
            
            this.enablePlayerInput();
            this.isProcessing = false;
        }, 10000); // 10 second timeout
        
        try {
            // Increment round counter
            this.negotiationRound++;
            console.log('Round incremented to:', this.negotiationRound);
            
            // Use Advanced Driver AI for analysis
            const context = this.buildConversationContext();
            if (!context) {
                throw new Error('Cannot build conversation context - location not properly initialized');
            }
            console.log('Built context:', context);
            
            // Check if advancedDriverAI exists
            if (!this.advancedDriverAI) {
                throw new Error('Advanced Driver AI not initialized');
            }
            
            const advancedAnalysis = this.advancedDriverAI.analyzePlayerInput(input, context);
            console.log('Advanced analysis completed:', advancedAnalysis);
            
            // Generate AI response (if available)
            let aiResponse = null;
            if (this.aiService.isAIAvailable()) {
                try {
                    const driverProfile = this.buildDriverProfile();
                    aiResponse = await this.aiService.generateDriverResponse(context, input, driverProfile);
                } catch (error) {
                    console.log('AI service failed, using advanced fallback');
                    aiResponse = { text: null, provider: 'fallback' };
                }
            }
            
            // Generate advanced driver response
            const advancedResponse = this.advancedDriverAI.generateAdvancedResponse(
                advancedAnalysis, context, aiResponse
            );
            
            // Apply price adjustment from advanced AI
            const newPrice = this.currentPrice - advancedResponse.priceAdjustment;
            const minPrice = this.currentLocation.fairPrice;
            const oldPrice = this.currentPrice;
            this.currentPrice = Math.max(minPrice, Math.round(newPrice));
            
            // Enhanced game features - sound effects
            if (window.gameFeatures) {
                // Play sound based on price change
                if (this.currentPrice < oldPrice) {
                    window.gameFeatures.soundManager.play('price_drop');
                } else if (advancedAnalysis.respectLevel === 'high') {
                    window.gameFeatures.soundManager.play('notification');
                }
                
                // Play typing sound during AI response
                window.gameFeatures.soundManager.play('typing');
            }
            
                    // Update cultural points from advanced analysis
        const oldCulturalPoints = this.culturalPoints;
        if (advancedAnalysis.culturalMarkers.malayalam.length > 0) {
            this.culturalPoints += advancedAnalysis.culturalMarkers.malayalam.length * 2;
        }
        if (advancedAnalysis.culturalMarkers.localRef.length > 0) {
            this.culturalPoints += advancedAnalysis.culturalMarkers.localRef.length;
        }
        
        // Track price change for feedback
        this.lastPriceChange = Math.abs(newPrice - this.currentPrice);
        
        // Track consecutive good moves
        if (advancedResponse.priceAdjustment > 5 || this.culturalPoints > oldCulturalPoints) {
            this.consecutiveGoodMoves++;
        } else {
            this.consecutiveGoodMoves = 0;
        }
            
            // Update driver mood from advanced AI
            this.updateDriverMoodFromAdvancedAI(advancedResponse.moodChange);
            
            // Clear timeout since we succeeded
            clearTimeout(timeoutId);
            
            // Display Advanced AI response
            setTimeout(() => {
                this.hideTypingIndicator();
                this.displayDriverDialogue(advancedResponse.text);
                this.addToConversationHistory('driver', advancedResponse.text);
                
                // Update UI
                this.updateNegotiationStats();
                
                // Show dynamic feedback for good moves
                this.showDynamicFeedback(advancedAnalysis, advancedResponse);
                
                // Debug logging with advanced info
                console.log(`Round ${this.negotiationRound}: Price ${this.currentPrice}, Mood: ${this.driverMood}, Cultural: ${this.culturalPoints}`);
                console.log(`Strategy: ${advancedResponse.strategy}, Player Strategy: ${advancedAnalysis.strategy}`);
                if (advancedResponse.driverThoughts) {
                    console.log(`Driver thinks: ${advancedResponse.driverThoughts}`);
                }
                
                // Check if negotiation should end
                if (this.shouldEndNegotiation()) {
                    console.log(`Ending negotiation after round ${this.negotiationRound}`);
                    setTimeout(() => this.endNegotiation(), 2000);
                } else {
                    this.enablePlayerInput();
                }
                
                this.isProcessing = false;
            }, 1200 + Math.random() * 1500); // Variable realistic typing delay
            
        } catch (error) {
            console.error('Error processing player input:', error);
            this.hideTypingIndicator();
            
            // Fallback to pre-written response if AI fails
            const fallbackResponse = this.getFallbackResponse(input);
            this.displayDriverDialogue(fallbackResponse);
            this.addToConversationHistory('driver', fallbackResponse);
            
            // Still do some basic price adjustment even if AI fails
            const basicAdjustment = Math.floor(Math.random() * 15) + 5; // 5-20 reduction
            this.currentPrice = Math.max(this.currentLocation.fairPrice, this.currentPrice - basicAdjustment);
            
            // Basic mood and cultural point adjustment
            if (input.toLowerCase().includes('uncle') || input.toLowerCase().includes('chettan')) {
                this.culturalPoints += 1;
                if (this.driverMood === 'annoyed') this.driverMood = 'neutral';
            }
            
            // Update UI
            this.updateNegotiationStats();
            
            console.log(`AI fallback used - Round ${this.negotiationRound}: Price ${this.currentPrice}`);
            
            this.enablePlayerInput();
            this.isProcessing = false;
        }
    }

    buildConversationContext() {
        if (!this.currentLocation) {
            console.error('Cannot build conversation context: no location selected');
            return null;
        }
        
        return {
            currentPrice: this.currentPrice || 0,
            fairPrice: this.currentLocation.fairPrice || 0,
            initialPrice: Math.round((this.currentLocation.fairPrice || 0) * (this.currentLocation.initialMultiplier || 1)),
            mood: this.driverMood || 'neutral',
            round: this.negotiationRound || 1,
            maxRounds: this.maxRounds || 8,
            culturalPoints: this.culturalPoints || 0
        };
    }

    buildDriverProfile() {
        const locationKey = Object.keys(LOCATIONS).find(key => LOCATIONS[key] === this.currentLocation);
        return {
            location: this.currentLocation.name,
            difficulty: this.currentLocation.difficulty,
            personality: this.currentLocation.driverPersonality,
            stubbornness: this.currentLocation.stubbornness,
            greediness: this.currentLocation.greediness
        };
    }

    updateDriverMoodFromAdvancedAI(moodChange) {
        const moods = ['angry', 'annoyed', 'neutral', 'happy'];
        let currentMoodIndex = moods.indexOf(this.driverMood);
        
        // Apply the mood change from advanced AI
        currentMoodIndex = Math.max(0, Math.min(3, Math.round(currentMoodIndex + moodChange)));
        this.driverMood = moods[currentMoodIndex];
        
        console.log(`Mood changed by ${moodChange} to ${this.driverMood}`);
    }

    // Legacy mood update method (kept for fallback compatibility)
    updateDriverMoodFromAnalysis(analysis) {
        let moodChange = 0;
        
        // Sentiment impact
        if (analysis.sentiment === 'positive') moodChange += 1;
        else if (analysis.sentiment === 'negative') moodChange -= 1;
        
        // Cultural awareness bonus
        if (analysis.culturalAwareness > 0) moodChange += 1;
        
        // Politeness vs assertiveness
        if (analysis.politeness > analysis.assertiveness) moodChange += 0.5;
        else if (analysis.assertiveness > analysis.politeness + 1) moodChange -= 0.5;
        
        // Strategy impact
        if (analysis.strategy === 'walk_away') moodChange -= 1;
        else if (analysis.strategy === 'cultural') moodChange += 0.5;
        
        // Apply personality modifiers
        const personality = this.currentLocation.driverPersonality;
        if (analysis.strategy === 'assertive' && personality.patience < 0.5) {
            moodChange -= 1;
        }
        
        // Update mood
        const moods = ['angry', 'annoyed', 'neutral', 'happy'];
        let currentMoodIndex = moods.indexOf(this.driverMood);
        currentMoodIndex = Math.max(0, Math.min(3, Math.round(currentMoodIndex + moodChange)));
        this.driverMood = moods[currentMoodIndex];
    }

    getDriverPhrase(category, subcategory = null) {
        const locationKey = Object.keys(LOCATIONS).find(key => LOCATIONS[key] === this.currentLocation);
        let phrases;
        
        if (subcategory) {
            phrases = DRIVER_PHRASES[category][subcategory];
        } else if (DRIVER_PHRASES[category][locationKey]) {
            phrases = DRIVER_PHRASES[category][locationKey];
        } else {
            phrases = DRIVER_PHRASES[category];
        }
        
        if (Array.isArray(phrases)) {
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            return randomPhrase.replace('{price}', this.currentPrice);
        }
        
        return phrases;
    }

    displayDriverDialogue(text) {
        const speechElement = document.getElementById('driver-speech');
        speechElement.innerHTML = '';
        
        // Typewriter effect
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                speechElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        typeWriter();
        
        // Update driver avatar based on mood
        this.updateDriverAvatar();
    }

    enablePlayerInput() {
        const playerInput = document.getElementById('player-input');
        const sendBtn = document.getElementById('send-btn');
        
        playerInput.disabled = false;
        playerInput.focus();
        sendBtn.disabled = playerInput.value.trim().length === 0;
    }

    disablePlayerInput() {
        const playerInput = document.getElementById('player-input');
        const sendBtn = document.getElementById('send-btn');
        
        playerInput.disabled = true;
        sendBtn.disabled = true;
    }

    showTypingIndicator() {
        document.getElementById('typing-indicator').classList.remove('hidden');
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    }

    addToConversationHistory(speaker, message) {
        const messagesContainer = document.getElementById('conversation-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `conversation-message ${speaker}`;
        
        const messageText = document.createElement('div');
        messageText.textContent = message;
        messageDiv.appendChild(messageText);
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        messageDiv.appendChild(timestamp);
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        const scrollContainer = document.querySelector('.conversation-scroll');
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        
        // Add to AI service history
        this.aiService.addToConversationHistory(speaker, message);
    }

    // Old methods removed - now using AI-powered text input system

    getFallbackResponse(input) {
        const inputLower = input.toLowerCase();
        const location = this.currentLocation.name.toLowerCase();
        
        // Analyze input for basic response
        if (inputLower.includes('uncle') || inputLower.includes('chettan')) {
            if (location.includes('uncle')) {
                return "Beta, you are good person. For you, ₹" + this.currentPrice + " is fair rate.";
            } else {
                return "You speak nicely! Okay, ₹" + this.currentPrice + " is good price.";
            }
        } else if (inputLower.includes('high') || inputLower.includes('much') || inputLower.includes('expensive')) {
            return "Sir, petrol price is very high these days. ₹" + this.currentPrice + " is minimum rate.";
        } else if (inputLower.includes('walk') || inputLower.includes('leave') || inputLower.includes('find another')) {
            return "Okay, okay! Don't go sir! ₹" + this.currentPrice + " final price!";
        } else if (inputLower.includes('local') || inputLower.includes('resident')) {
            return "Local person also pays same rate. ₹" + this.currentPrice + " is fair.";
        } else {
            // Generic response
            const responses = [
                "₹" + this.currentPrice + " is very reasonable rate, sir.",
                "This is fair price for this distance. ₹" + this.currentPrice + " only.",
                "Other drivers will charge more. ₹" + this.currentPrice + " is good deal.",
                "Traffic is heavy today. ₹" + this.currentPrice + " is minimum rate."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    updateDriverAvatar() {
        const avatarElement = document.getElementById('driver-avatar');
        const moodElement = document.getElementById('driver-mood');
        const moodEmoji = DRIVER_PHRASES.moods[this.driverMood].emoji;
        
        // Animate mood change
        const oldMood = moodElement.textContent;
        if (oldMood !== moodEmoji && oldMood !== '😐') {
            moodElement.classList.add('mood-changed');
            setTimeout(() => {
                moodElement.classList.remove('mood-changed');
            }, 500);
        }
        
        avatarElement.textContent = moodEmoji;
        moodElement.textContent = moodEmoji;
    }

    getMoodMultiplier() {
        const moodMultipliers = {
            'angry': -0.3,
            'annoyed': -0.1,
            'neutral': 0,
            'happy': 0.2
        };
        return moodMultipliers[this.driverMood] || 0;
    }

    getRandomFactor() {
        return 0.7 + (Math.random() * 0.6); // Random factor between 0.7 and 1.3
    }

    shouldEndNegotiation() {
        // Don't end too early - need minimum rounds for meaningful negotiation
        if (this.negotiationRound < 3) return false;
        
        // End conditions
        if (this.negotiationRound >= this.maxRounds) return true;
        
        // Only end if driver is very angry and has been negotiating for a while
        if (this.driverMood === 'angry' && this.negotiationRound >= 4 && Math.random() > 0.6) return true;
        
        // End if reached fair price AND had enough rounds of negotiation
        if (this.currentPrice <= this.currentLocation.fairPrice && this.negotiationRound >= 4) {
            return Math.random() > 0.5; // 50% chance to continue even at fair price
        }
        
        // Small chance to end if very close to fair price and negotiated enough
        if (this.currentPrice <= this.currentLocation.fairPrice * 1.05 && this.negotiationRound >= 5) {
            return Math.random() > 0.8; // 20% chance to end
        }
        
        return false;
    }

    endNegotiation() {
        this.gameState = 'ended';
        this.calculateFinalScore();
        this.showResults();
    }

    calculateFinalScore() {
        const fairPrice = this.currentLocation.fairPrice;
        const initialPrice = Math.round(fairPrice * this.currentLocation.initialMultiplier);
        
        // Base score: savings percentage
        const savings = initialPrice - this.currentPrice;
        const maxSavings = initialPrice - fairPrice;
        const savingsScore = Math.round((savings / maxSavings) * 50);
        
        // Cultural bonus
        const culturalBonus = Math.min(this.culturalPoints * 2, 20);
        
        // Efficiency bonus (fewer rounds is better)
        const efficiencyBonus = Math.max(0, (this.maxRounds - this.negotiationRound) * 2);
        
        // Mood bonus
        const moodBonus = this.driverMood === 'happy' ? 15 : this.driverMood === 'neutral' ? 5 : 0;
        
        this.playerScore = Math.max(0, savingsScore + culturalBonus + efficiencyBonus + moodBonus);
    }

    showResults() {
        const resultPanel = document.getElementById('result-panel');
        const titleElement = document.getElementById('result-title');
        const messageElement = document.getElementById('result-message');
        const scoreElement = document.getElementById('score-details');
        
        let title, message, grade;
        
        if (this.playerScore >= 80) {
            title = "🏆 Master Negotiator!";
            message = "You've truly mastered the art of auto negotiation! Uncle would be proud.";
            grade = "A+";
        } else if (this.playerScore >= 60) {
            title = "😊 Well Done!";
            message = "Good negotiation skills! You saved money and maintained respect.";
            grade = "B+";
        } else if (this.playerScore >= 40) {
            title = "👍 Not Bad!";
            message = "You're learning! With practice, you'll become a negotiation expert.";
            grade = "C+";
        } else {
            title = "🤔 Keep Practicing!";
            message = "Negotiation is an art. Don't worry, even locals need practice!";
            grade = "D";
        }
        
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        const fairPrice = this.currentLocation.fairPrice;
        const initialPrice = Math.round(fairPrice * this.currentLocation.initialMultiplier);
        const savings = initialPrice - this.currentPrice;
        
        scoreElement.innerHTML = `
            <h4>Final Score: ${this.playerScore}/100 (Grade: ${grade})</h4>
            <div style="margin-top: 15px;">
                <div>💰 Initial Price: ₹${initialPrice}</div>
                <div>🎯 Final Price: ₹${this.currentPrice}</div>
                <div>💵 Amount Saved: ₹${savings}</div>
                <div>🏛️ Cultural Points: ${this.culturalPoints}</div>
                <div>🕐 Rounds Used: ${this.negotiationRound}/${this.maxRounds}</div>
                <div>😊 Final Mood: ${DRIVER_PHRASES.moods[this.driverMood].emoji}</div>
            </div>
        `;
        
        resultPanel.classList.remove('hidden');
        
        // Enhanced game features integration
        if (window.gameFeatures) {
            // Play appropriate sound
            if (this.playerScore >= 80) {
                window.gameFeatures.soundManager.play('achievement');
            } else if (this.playerScore >= 60) {
                window.gameFeatures.soundManager.play('success');
            } else {
                window.gameFeatures.soundManager.play('notification');
            }
            
            // Record analytics
            const malayalamWordsUsed = this.negotiationHistory.filter(entry => 
                entry.speaker === 'player' && 
                (entry.message.toLowerCase().includes('uncle') || 
                 entry.message.toLowerCase().includes('chettan') ||
                 entry.message.toLowerCase().includes('ayyo') ||
                 entry.message.toLowerCase().includes('namaskaram'))
            ).length;
            
            window.gameFeatures.analytics.recordNegotiation({
                success: this.playerScore >= 60,
                savings: savings,
                rounds: this.negotiationRound,
                malayalamWordsUsed: malayalamWordsUsed,
                culturalPoints: this.culturalPoints,
                location: this.currentLocation.name
            });
            
            // Update reputation
            window.gameFeatures.reputationSystem.updateReputation(
                this.currentLocation.name,
                { success: this.playerScore >= 60, savings: savings },
                {
                    politeness: this.culturalPoints > 0 ? 1 : 0,
                    cultural_awareness: malayalamWordsUsed > 0 ? 1 : 0,
                    negotiation_skill: this.playerScore >= 60 ? 1 : 0,
                    patience: this.negotiationRound <= 3 ? 1 : 0,
                    humor: this.driverMood === 'happy' ? 1 : 0
                }
            );
            
            // Check achievements
            const achievements = window.gameFeatures.achievements;
            achievements.checkAchievement('first_negotiation');
            
            // Score-based achievements
            if (this.playerScore >= 80) {
                achievements.checkAchievement('bargain_master');
            }
            
            // Cultural achievements
            if (malayalamWordsUsed >= 10) {
                achievements.checkAchievement('cultural_ambassador');
            }
            
            if (this.driverMood === 'happy') {
                achievements.checkAchievement('sweet_talker');
            }
            
            // Location-specific achievements
            if (this.currentLocation.name.includes('Airport') && this.currentPrice <= this.currentLocation.fairPrice) {
                achievements.checkAchievement('tough_negotiator');
            }
            
            if (this.currentLocation.name.includes('Uncle') && this.playerScore >= 60) {
                achievements.checkAchievement('uncle_friend');
            }
            
            // Check time-based achievements
            const hour = new Date().getHours();
            if (hour <= 6) achievements.checkAchievement('early_bird');
            if (hour >= 0 && hour <= 2) achievements.checkAchievement('night_owl');
            
            // Check weather-based achievements
            if (window.gameFeatures.weather.currentWeather === 'rainy') {
                achievements.checkAchievement('monsoon_rider');
            }
            
            if (window.gameFeatures.weather.currentWeather === 'festival') {
                achievements.checkAchievement('festival_expert');
            }
            
            // Advanced achievements
            if (this.negotiationRound <= 3 && this.playerScore >= 70) {
                achievements.checkAchievement('negotiation_ninja');
            }
            
            if (this.culturalPoints >= 10) {
                achievements.checkAchievement('culture_guru');
            }
            
            // Submit to leaderboard
            const playerName = localStorage.getItem('autoNegotiator_playerName') || 'Anonymous';
            const rank = window.gameFeatures.leaderboard.submitScore(
                playerName, this.playerScore, this.currentLocation.name, savings
            );
            
            // Update reputation display
            const reputationLevel = window.gameFeatures.reputationSystem.getReputationLevel();
            const reputationElement = document.getElementById('reputation-level');
            if (reputationElement) {
                reputationElement.textContent = reputationLevel.level;
                reputationElement.style.color = reputationLevel.color;
            }
            
            // Show rank achievement if in top 10
            if (rank <= 10) {
                setTimeout(() => {
                    window.gameFeatures.socialFeatures.showToast(`🏆 You're ranked #${rank} on the leaderboard!`);
                }, 3000);
            }
            
            // Add share button for good scores
            if (this.playerScore >= 60) {
                const shareBtn = document.createElement('button');
                shareBtn.className = 'btn share-btn';
                shareBtn.innerHTML = '📱 Share Your Score';
                shareBtn.style.marginTop = '15px';
                shareBtn.onclick = () => {
                    window.gameFeatures.socialFeatures.shareScore(
                        this.playerScore, 
                        this.currentLocation.name, 
                        savings
                    );
                };
                scoreElement.appendChild(shareBtn);
            }
        }
    }

    updatePriceDisplay() {
        if (!this.currentLocation) {
            console.warn('Cannot update price display: no location selected');
            // Force display ₹0 values when no location
            const elements = ['initial-price', 'current-price', 'fair-price'];
            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.textContent = '₹0';
            });
            return;
        }
        
        const fairPrice = this.currentLocation.fairPrice;
        const initialPrice = Math.round(fairPrice * this.currentLocation.initialMultiplier);
        
        // Safety check for valid prices
        if (!fairPrice || fairPrice <= 0) {
            console.error('Invalid fair price:', fairPrice, 'for location:', this.currentLocation.name);
            return;
        }
        
        // Ensure currentPrice is set
        if (!this.currentPrice || this.currentPrice === 0) {
            this.currentPrice = initialPrice;
            console.log('Current price was 0, setting to initial price:', initialPrice);
        }
        
        // Update all price elements with error checking
        const initialPriceElement = document.getElementById('initial-price');
        const currentPriceElement = document.getElementById('current-price');
        const fairPriceElement = document.getElementById('fair-price');
        
        if (!initialPriceElement || !currentPriceElement || !fairPriceElement) {
            console.error('Price display elements not found!', {
                initial: !!initialPriceElement,
                current: !!currentPriceElement,  
                fair: !!fairPriceElement
            });
            return;
        }
        
        initialPriceElement.textContent = `₹${initialPrice}`;
        
        // Animate price change
        const oldPrice = currentPriceElement.textContent;
        const newPrice = `₹${this.currentPrice}`;
        
        if (oldPrice !== newPrice && oldPrice !== '₹0') {
            currentPriceElement.classList.add('price-changed');
            setTimeout(() => {
                currentPriceElement.classList.remove('price-changed');
            }, 600);
        }
        
        currentPriceElement.textContent = newPrice;
        fairPriceElement.textContent = `₹${fairPrice}`;
        
        console.log('Price display updated successfully:', {
            initial: initialPrice,
            current: this.currentPrice,
            fair: fairPrice,
            location: this.currentLocation.name
        });
    }

    updateNegotiationStats() {
        this.updatePriceDisplay();
        this.updateDriverAvatar();
        
        // Update round counter
        document.getElementById('round-counter').textContent = `${this.negotiationRound}/${this.maxRounds}`;
        
        // Update AI status with proper status tracking
        const aiStatus = document.getElementById('ai-status');
        if (this.apiConfigurationStatus === 'connected') {
            aiStatus.textContent = `${this.aiService.selectedProvider} ✓`;
            aiStatus.className = 'connected';
        } else if (this.apiConfigurationStatus === 'error') {
            aiStatus.textContent = `${this.aiService.selectedProvider} ⚠️`;
            aiStatus.className = 'error';
        } else if (this.apiConfigurationStatus === 'fallback') {
            aiStatus.textContent = 'Advanced Fallback';
            aiStatus.className = '';
        } else {
            aiStatus.textContent = 'Not configured';
            aiStatus.className = '';
        }
    }

    updateVREnvironment() {
        if (!this.currentLocation) return;
        
        const environment = document.getElementById('environment');
        const env = this.currentLocation.environment;
        
        environment.setAttribute('environment', 
            `preset: ${env.preset}; groundColor: ${env.groundColor}; grid: ${env.grid}; fog: ${env.fog || 0}`
        );
        
        // Update sky color based on time of day
        const sky = document.querySelector('a-sky');
        const timeColors = {
            morning: '#87CEEB',
            day: '#87CEEB',
            evening: '#FFA500',
            night: '#191970'
        };
        sky.setAttribute('color', timeColors[this.currentLocation.timeOfDay] || '#87CEEB');
    }

    loadVRScene() {
        const scene = document.getElementById('vr-scene');
        
        scene.addEventListener('loaded', () => {
            console.log('VR Scene loaded successfully');
        });
        
        // Add VR controller support
        scene.addEventListener('enter-vr', () => {
            console.log('Entered VR mode');
            document.body.classList.add('vr-mode');
        });
        
        scene.addEventListener('exit-vr', () => {
            console.log('Exited VR mode');
            document.body.classList.remove('vr-mode');
        });
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = screenName === 'start' ? 'start-screen' : 'game-screen';
        document.getElementById(targetScreen).classList.add('active');
    }

    resetGame() {
        this.gameState = 'menu';
        this.negotiationRound = 0;
        this.driverMood = 'neutral';
        this.currentPrice = 0;
        this.playerScore = 0;
        this.culturalPoints = 0;
        this.negotiationHistory = [];
        this.isProcessing = false;
        this.lastPriceChange = 0;
        this.consecutiveGoodMoves = 0;
        
        // Reset location selection
        this.currentLocation = null;
        this.advancedDriverAI = null;
        
        // Clear conversation history
        document.getElementById('conversation-messages').innerHTML = '';
        document.getElementById('player-input').value = '';
        
        // Reset location selection UI
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Clear location info
        document.getElementById('location-name').textContent = '';
        document.getElementById('difficulty-indicator').textContent = '';
        
        // Reset price display
        document.getElementById('initial-price').textContent = '₹0';
        document.getElementById('current-price').textContent = '₹0';
        document.getElementById('fair-price').textContent = '₹0';
        
        // Reset UI
        document.getElementById('result-panel').classList.add('hidden');
        this.hideTypingIndicator();
        this.showScreen('start');
        
        console.log('Game reset completed');
    }

    showDynamicFeedback(analysis, response) {
        // Show positive feedback for good moves
        if (response.priceAdjustment > 10) {
            this.showFloatingMessage("Great negotiation! -₹" + response.priceAdjustment, 'success');
        }
        
        if (analysis.culturalMarkers.malayalam.length > 0) {
            this.showFloatingMessage("Cultural bonus! +" + (analysis.culturalMarkers.malayalam.length * 2) + " points", 'cultural');
        }
        
        if (this.consecutiveGoodMoves >= 3) {
            this.showFloatingMessage("Negotiation streak! 🔥", 'streak');
        }
        
        if (analysis.sentiment === 'positive' && response.moodChange > 0) {
            this.showFloatingMessage("Driver likes your approach! 😊", 'mood');
        }
    }

    showFloatingMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `floating-message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20%;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            z-index: 2000;
            animation: floatUp 3s ease-out forwards;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        `;
        
        // Different colors for different types
        if (type === 'cultural') messageDiv.style.background = 'rgba(103, 58, 183, 0.9)';
        if (type === 'streak') messageDiv.style.background = 'rgba(255, 152, 0, 0.9)';
        if (type === 'mood') messageDiv.style.background = 'rgba(233, 30, 99, 0.9)';
        
        document.body.appendChild(messageDiv);
        
        // Remove after animation
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
}

// Cultural tips display functions
function showCulturalTips() {
    const tipsHtml = `
        <div class="cultural-tips">
            <h3>🏛️ Cultural Tips for Auto Negotiation</h3>
            <div class="tips-section">
                <h4>✅ Do's:</h4>
                <ul>
                    ${CULTURAL_TIPS.dos.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            <div class="tips-section">
                <h4>❌ Don'ts:</h4>
                <ul>
                    ${CULTURAL_TIPS.donts.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            <div class="tips-section">
                <h4>💡 Insider Knowledge:</h4>
                <ul>
                    ${CULTURAL_TIPS.insider_knowledge.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Create modal or popup to display tips
    console.log(tipsHtml);
}

function showMalayalamGuide() {
    const malayalamHtml = `
        <div class="malayalam-guide">
            <h3>🗣️ Basic Malayalam for Auto Negotiation</h3>
            ${Object.entries(MALAYALAM_BASICS).map(([category, phrases]) => `
                <div class="phrase-category">
                    <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    ${Object.entries(phrases).map(([malayalam, english]) => `
                        <div class="phrase-item">
                            <strong>${malayalam}</strong> - ${english}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
    
    console.log(malayalamHtml);
}

// Global function for AI configuration (called from HTML)
async function configureAI(provider) {
    if (!window.autoGame) return;
    
    let apiKey = null;
    
    if (provider === 'openai') {
        apiKey = document.getElementById('openai-key').value.trim();
        if (!apiKey) {
            alert('Please enter your OpenAI API key');
            return;
        }
    }
    
    // Show loading state
    const configButtons = document.querySelectorAll('.ai-option button');
    configButtons.forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'Testing...';
    });
    
    try {
        window.autoGame.aiService.setProvider(provider, apiKey);
        
        if (provider === 'fallback') {
            // Fallback mode - always works
            window.autoGame.apiConfigurationStatus = 'fallback';
            alert('✅ Advanced Fallback Mode enabled!\n\nFeatures intelligent conversation analysis and dynamic responses.');
        } else {
            // Test the AI connection
            window.autoGame.apiConfigurationStatus = 'testing';
            
            // Initialize the service
            window.autoGame.aiService.initialize(apiKey, provider);
            
            // Test with a simple request
            const testContext = {
                currentPrice: 100,
                fairPrice: 80,
                initialPrice: 150,
                mood: 'neutral',
                round: 1,
                maxRounds: 8,
                culturalPoints: 0
            };
            
            const testProfile = {
                location: 'Test Location',
                difficulty: 'medium',
                personality: { patience: 0.5, humor: 0.5, localKnowledge: 0.5, touristFriendly: 0.5 },
                stubbornness: 0.5,
                greediness: 0.5
            };
            
            try {
                const testResponse = await window.autoGame.aiService.generateDriverResponse(
                    testContext, 
                    'Test connection', 
                    testProfile
                );
                
                if (testResponse && testResponse.text) {
                    window.autoGame.apiConfigurationStatus = 'connected';
                    const statusMessages = {
                        'openai': '✅ OpenAI connected successfully!\n\nYou now have access to dynamic, intelligent conversations.',
                        'ollama': '✅ Ollama connected successfully!\n\nLocal AI is ready for private, offline conversations.'
                    };
                    alert(statusMessages[provider]);
                } else {
                    throw new Error('Invalid response from AI service');
                }
            } catch (testError) {
                console.warn('AI service test failed, but will use fallback:', testError);
                window.autoGame.apiConfigurationStatus = 'error';
                alert(`⚠️ ${provider} configuration saved but connection test failed.\n\nThe system will try to use ${provider} but fall back to advanced responses if needed.\n\nError: ${testError.message}`);
            }
        }
        
        window.autoGame.hideAIConfigModal();
        window.autoGame.updateNegotiationStats();
        
    } catch (error) {
        console.error('AI Configuration error:', error);
        window.autoGame.apiConfigurationStatus = 'unconfigured';
        alert(`❌ Error configuring ${provider}.\n\nPlease check your settings and try again.\n\nError: ${error.message}`);
    } finally {
        // Reset button states
        configButtons.forEach(btn => {
            btn.disabled = false;
        });
        // Reset button texts
        document.querySelector('[onclick="configureAI(\'openai\')"]').textContent = 'Use OpenAI';
        document.querySelector('[onclick="configureAI(\'ollama\')"]').textContent = 'Use Local Ollama';
        document.querySelector('[onclick="configureAI(\'fallback\')"]').textContent = 'Use Fallback Mode';
    }
}

// Debug function for testing pricing system
window.debugPricing = function() {
    if (!window.autoGame) {
        console.error('Game not initialized');
        return;
    }
    
    const game = window.autoGame;
    console.log('=== PRICING DEBUG ===');
    console.log('Current Location:', game.currentLocation);
    console.log('Current Price:', game.currentPrice);
    console.log('Available Locations:', Object.keys(LOCATIONS));
    
    if (game.currentLocation) {
        console.log('Location Details:', {
            name: game.currentLocation.name,
            fairPrice: game.currentLocation.fairPrice,
            initialMultiplier: game.currentLocation.initialMultiplier,
            calculatedInitial: Math.round(game.currentLocation.fairPrice * game.currentLocation.initialMultiplier)
        });
    }
    
    // Test HTML elements
    const elements = ['initial-price', 'current-price', 'fair-price'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`${id}:`, element ? element.textContent : 'NOT FOUND');
    });
    
    // Force update
    if (game.currentLocation) {
        game.updatePriceDisplay();
        console.log('Forced price display update');
    }
};

// Force pricing function 
window.forcePricing = function() {
    if (!window.autoGame) {
        console.error('Game not initialized');
        return;
    }
    
    const game = window.autoGame;
    
    // Force select uncle location if no location
    if (!game.currentLocation) {
        console.log('Forcing uncle location selection...');
        game.selectLocation('uncle');
    }
    
    // Force price initialization
    if (game.currentLocation) {
        game.currentPrice = Math.round(game.currentLocation.fairPrice * game.currentLocation.initialMultiplier);
        game.updatePriceDisplay();
        console.log('Forced pricing:', game.currentPrice);
    }
};

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all scripts are fully loaded
    setTimeout(() => {
        try {
            window.autoGame = new AutoNegotiationGame();
            console.log('Game successfully initialized');
            console.log('Use debugPricing() or forcePricing() in console for debugging');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            alert('Game initialization failed. Please refresh the page or check the debug page.');
        }
    }, 200);
    
    // Add keyboard shortcuts for text input
    document.addEventListener('keydown', (e) => {
        if (window.autoGame && window.autoGame.gameState === 'playing') {
            // Focus on input when typing (unless already focused)
            const playerInput = document.getElementById('player-input');
            if (e.key.length === 1 && document.activeElement !== playerInput) {
                playerInput.focus();
                playerInput.value += e.key;
                e.preventDefault();
            }
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoNegotiationGame;
}

// Make available globally
window.AutoNegotiationGame = AutoNegotiationGame; 