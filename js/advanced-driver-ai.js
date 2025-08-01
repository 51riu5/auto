// Advanced Driver AI for Auto-Rickshaw Negotiation Simulator

class AdvancedDriverAI {
    constructor(location, driverProfile) {
        this.location = location;
        this.profile = driverProfile;
        this.negotiationMemory = [];
        this.playerProfileEstimate = {
            isLocal: false,
            culturalAwareness: 0,
            negotiationSkill: 0,
            politeness: 0,
            patience: 5, // 1-10 scale
            priceFlexibility: 5 // How much they seem willing to negotiate
        };
        this.currentStrategy = this.selectInitialStrategy();
        this.conversationTurn = 0;
        this.lastResponseTypes = []; // Track recent response types to avoid repetition
        this.priceHistory = [];
        this.moodFactors = {
            timeOfDay: this.getTimeOfDayMood(),
            weatherImpact: Math.random() * 0.2 - 0.1, // -0.1 to +0.1
            businessToday: Math.random() * 0.3 - 0.15, // -0.15 to +0.15
            personalMood: Math.random() * 0.2 - 0.1
        };
    }

    selectInitialStrategy() {
        const strategies = ['aggressive', 'moderate', 'friendly', 'testing'];
        const weights = [
            this.profile.difficulty === 'nightmare' ? 0.4 : 0.1,  // aggressive
            0.4,  // moderate
            this.profile.difficulty === 'tutorial' ? 0.4 : 0.2,   // friendly
            0.1   // testing
        ];
        
        return this.weightedRandomChoice(strategies, weights);
    }

    weightedRandomChoice(items, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            if (random < weights[i]) {
                return items[i];
            }
            random -= weights[i];
        }
        return items[items.length - 1];
    }

    analyzePlayerInput(input, context) {
        this.conversationTurn++;
        const analysis = {
            input: input.toLowerCase(),
            length: input.length,
            sentiment: this.analyzeSentiment(input),
            strategy: this.identifyPlayerStrategy(input),
            culturalMarkers: this.findCulturalMarkers(input),
            priceExpectation: this.extractPriceExpectation(input),
            urgency: this.detectUrgency(input),
            respectLevel: this.assessRespectLevel(input)
        };

        // Update player profile estimate
        this.updatePlayerProfile(analysis);
        
        // Add to memory
        this.negotiationMemory.push({
            turn: this.conversationTurn,
            playerInput: input,
            analysis: analysis,
            contextPrice: context.currentPrice,
            driverMood: context.mood
        });

        return analysis;
    }

    analyzeSentiment(input) {
        const positive = ['good', 'nice', 'fair', 'reasonable', 'thank', 'please', 'appreciate', 'understand', 'respect'];
        const negative = ['bad', 'terrible', 'ridiculous', 'stupid', 'crazy', 'unfair', 'cheating', 'robbery'];
        const neutral = ['okay', 'fine', 'sure', 'alright'];

        const words = input.toLowerCase().split(/\s+/);
        let positiveScore = 0;
        let negativeScore = 0;
        let neutralScore = 0;

        words.forEach(word => {
            if (positive.some(p => word.includes(p))) positiveScore++;
            if (negative.some(n => word.includes(n))) negativeScore++;
            if (neutral.some(n => word.includes(n))) neutralScore++;
        });

        if (positiveScore > negativeScore) return 'positive';
        if (negativeScore > positiveScore) return 'negative';
        return 'neutral';
    }

    identifyPlayerStrategy(input) {
        const strategies = {
            'walk_away': ['walk', 'leave', 'find another', 'other auto', 'bus', 'uber', 'ola'],
            'cultural': ['uncle', 'chettan', 'setta', 'local', 'malayali', 'kerala', 'family'],
            'aggressive': ['must', 'should', 'have to', 'demand', 'insist', 'final offer'],
            'emotional': ['poor', 'student', 'help', 'please', 'need', 'struggling'],
            'logical': ['meter', 'distance', 'time', 'petrol', 'rate', 'standard'],
            'flattery': ['good driver', 'nice person', 'honest', 'trustworthy', 'experienced']
        };

        const inputLower = input.toLowerCase();
        const detectedStrategies = [];

        for (const [strategy, keywords] of Object.entries(strategies)) {
            if (keywords.some(keyword => inputLower.includes(keyword))) {
                detectedStrategies.push(strategy);
            }
        }

        return detectedStrategies.length > 0 ? detectedStrategies[0] : 'neutral';
    }

    findCulturalMarkers(input) {
        const malayalamWords = ['uncle', 'chettan', 'setta', 'namaskaram', 'vanakkam', 'nanni', 'ayyye'];
        const localReferences = ['kerala', 'kochi', 'ernakulam', 'malayali', 'local'];
        const respectTerms = ['sir', 'madam', 'ji'];

        const inputLower = input.toLowerCase();
        const markers = {
            malayalam: malayalamWords.filter(word => inputLower.includes(word)),
            localRef: localReferences.filter(word => inputLower.includes(word)),
            respect: respectTerms.filter(word => inputLower.includes(word))
        };

        return markers;
    }

    extractPriceExpectation(input) {
        const priceRegex = /₹?(\d+)/g;
        const matches = input.match(priceRegex);
        if (matches && matches.length > 0) {
            return parseInt(matches[matches.length - 1].replace('₹', ''));
        }
        return null;
    }

    detectUrgency(input) {
        const urgentWords = ['hurry', 'quick', 'fast', 'urgent', 'late', 'rush', 'immediately'];
        const relaxedWords = ['no hurry', 'take time', 'whenever', 'no rush'];
        
        const inputLower = input.toLowerCase();
        
        if (urgentWords.some(word => inputLower.includes(word))) return 'high';
        if (relaxedWords.some(word => inputLower.includes(word))) return 'low';
        return 'medium';
    }

    assessRespectLevel(input) {
        const respectfulMarkers = ['please', 'thank you', 'sir', 'uncle', 'excuse me', 'sorry'];
        const rudeMarkers = ['stupid', 'idiot', 'cheat', 'liar', 'ridiculous'];
        
        const inputLower = input.toLowerCase();
        let respectScore = 0;
        
        respectfulMarkers.forEach(marker => {
            if (inputLower.includes(marker)) respectScore += 1;
        });
        
        rudeMarkers.forEach(marker => {
            if (inputLower.includes(marker)) respectScore -= 2;
        });

        if (respectScore >= 2) return 'high';
        if (respectScore <= -1) return 'low';
        return 'medium';
    }

    updatePlayerProfile(analysis) {
        // Update cultural awareness
        const culturalPoints = analysis.culturalMarkers.malayalam.length * 2 + 
                             analysis.culturalMarkers.localRef.length + 
                             analysis.culturalMarkers.respect.length;
        this.playerProfileEstimate.culturalAwareness += culturalPoints;

        // Update negotiation skill based on strategy variety and effectiveness
        if (['logical', 'walk_away', 'cultural'].includes(analysis.strategy)) {
            this.playerProfileEstimate.negotiationSkill += 1;
        }

        // Update politeness
        if (analysis.respectLevel === 'high') this.playerProfileEstimate.politeness += 1;
        if (analysis.respectLevel === 'low') this.playerProfileEstimate.politeness -= 1;

        // Update patience based on conversation length and urgency
        if (analysis.urgency === 'high') this.playerProfileEstimate.patience -= 1;
        if (this.conversationTurn > 5) this.playerProfileEstimate.patience -= 0.5;

        // Determine if local
        if (analysis.culturalMarkers.localRef.length > 0 || analysis.culturalMarkers.malayalam.length > 1) {
            this.playerProfileEstimate.isLocal = true;
        }
    }

    generateAdvancedResponse(analysis, context, aiResponse = null) {
        // Adapt strategy based on negotiation progress
        this.adaptStrategy(analysis, context);
        
        // Calculate price adjustment using advanced logic
        const priceAdjustment = this.calculateSmartPriceAdjustment(analysis, context);
        
        // Generate contextual response
        let response;
        if (aiResponse && aiResponse.text && aiResponse.provider !== 'fallback') {
            // Enhance AI response with driver personality
            response = this.enhanceAIResponse(aiResponse.text, analysis, context);
        } else {
            // Generate sophisticated fallback response
            response = this.generateContextualResponse(analysis, context);
        }

        // Add personality quirks and mood indicators
        response = this.addPersonalityTouch(response, context);

        // Track response type to avoid repetition
        this.trackResponseType(response);

        return {
            text: response,
            priceAdjustment: priceAdjustment,
            moodChange: this.calculateMoodChange(analysis, context),
            strategy: this.currentStrategy,
            driverThoughts: this.generateDriverThoughts(analysis, context) // For debugging/flavor
        };
    }

    adaptStrategy(analysis, context) {
        const turnsSinceStrategyChange = this.conversationTurn - (this.lastStrategyChange || 0);
        
        // Change strategy based on player behavior and negotiation progress
        if (turnsSinceStrategyChange >= 2) {
            if (analysis.strategy === 'walk_away' && this.currentStrategy !== 'panic') {
                this.currentStrategy = 'panic';
                this.lastStrategyChange = this.conversationTurn;
            } else if (this.playerProfileEstimate.politeness > 3 && this.currentStrategy === 'aggressive') {
                this.currentStrategy = 'friendly';
                this.lastStrategyChange = this.conversationTurn;
            } else if (context.round > 4 && this.currentStrategy === 'testing') {
                this.currentStrategy = Math.random() > 0.5 ? 'moderate' : 'aggressive';
                this.lastStrategyChange = this.conversationTurn;
            }
        }
    }

    calculateSmartPriceAdjustment(analysis, context) {
        let baseAdjustment = 0;
        
        // Strategy-based adjustment
        switch (analysis.strategy) {
            case 'walk_away':
                baseAdjustment = this.profile.stubbornness > 0.7 ? 8 : 15;
                break;
            case 'cultural':
                baseAdjustment = 10 + (this.profile.personality.localKnowledge * 8);
                break;
            case 'logical':
                baseAdjustment = 8 + (this.playerProfileEstimate.negotiationSkill * 2);
                break;
            case 'emotional':
                baseAdjustment = this.profile.personality.touristFriendly * 12;
                break;
            case 'aggressive':
                baseAdjustment = Math.max(2, 10 - (this.profile.stubbornness * 10));
                break;
            case 'flattery':
                baseAdjustment = 6 + (this.profile.personality.humor * 5);
                break;
            default:
                baseAdjustment = 5;
        }

        // Sentiment modifier
        if (analysis.sentiment === 'positive') baseAdjustment += 3;
        if (analysis.sentiment === 'negative') baseAdjustment -= 2;

        // Cultural awareness bonus
        baseAdjustment += this.playerProfileEstimate.culturalAwareness * 1.5;

        // Specific price mentioned - shows serious negotiation
        if (analysis.priceExpectation) {
            const priceDiff = context.currentPrice - analysis.priceExpectation;
            if (priceDiff > 0 && priceDiff < context.currentPrice * 0.3) {
                baseAdjustment += 5; // Reasonable counter-offer
            }
        }

        // Round-based progression
        const roundMultiplier = Math.min(1.5, 1 + (context.round * 0.1));
        baseAdjustment *= roundMultiplier;

        // Driver strategy modifier
        switch (this.currentStrategy) {
            case 'panic':
                baseAdjustment *= 1.5;
                break;
            case 'friendly':
                baseAdjustment *= 1.2;
                break;
            case 'aggressive':
                baseAdjustment *= 0.7;
                break;
        }

        // Randomization to prevent predictability
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        baseAdjustment *= randomFactor;

        return Math.max(3, Math.min(25, Math.round(baseAdjustment)));
    }

    generateContextualResponse(analysis, context) {
        // First, try to generate a direct response to what the user said
        const directResponse = this.generateDirectResponse(analysis, context);
        if (directResponse) {
            return directResponse;
        }
        
        // Fallback to pool-based responses
        const responsePool = this.buildResponsePool(analysis, context);
        
        // Avoid repetition
        const availableResponses = responsePool.filter(response => 
            !this.lastResponseTypes.includes(this.categorizeResponse(response))
        );
        
        const selectedResponses = availableResponses.length > 0 ? availableResponses : responsePool;
        const baseResponse = selectedResponses[Math.floor(Math.random() * selectedResponses.length)];
        
        // Add dynamic price and context
        return baseResponse.replace('{price}', context.currentPrice)
                          .replace('{location}', this.location.name)
                          .replace('{round}', context.round);
    }
    
    generateDirectResponse(analysis, context) {
        const playerInput = analysis.originalInput ? analysis.originalInput.toLowerCase() : '';
        const price = context.currentPrice;
        const fairPrice = context.fairPrice;
        
        // Direct responses to specific things the player said
        
        // Handle specific price mentions
        if (analysis.priceExpectation && analysis.priceExpectation < price) {
            const gap = price - analysis.priceExpectation;
            if (gap > fairPrice * 0.3) {
                return `₹${analysis.priceExpectation}? Ayyo sir, that's too low! Even petrol costs more than that. ₹${Math.max(fairPrice + 10, price - 20)} is minimum I can do.`;
            } else {
                return `₹${analysis.priceExpectation} is close... but I need at least ₹${Math.max(fairPrice, price - 15)} to make it worthwhile.`;
            }
        }
        
        // Respond to specific complaints
        if (playerInput.includes('petrol') || playerInput.includes('fuel')) {
            return `Exactly sir! You understand - petrol is ₹95 per liter now! That's why ₹${price} is necessary for this distance.`;
        }
        
        if (playerInput.includes('traffic')) {
            return `Yes yes, traffic is terrible! More time means more petrol burning. ₹${price} covers the traffic delay also.`;
        }
        
        if (playerInput.includes('raining') || playerInput.includes('rain')) {
            return `Monsoon time is difficult for driving sir. Extra careful needed. ₹${price} includes weather risk also.`;
        }
        
        if (playerInput.includes('festival') || playerInput.includes('celebration')) {
            return `During festival time, everyone needs auto! Demand is high, so ₹${price} is festival rate sir.`;
        }
        
        // Personal appeals
        if (playerInput.includes('family') || playerInput.includes('wife') || playerInput.includes('children')) {
            return `I understand sir, I also have family to feed. But ₹${Math.max(fairPrice, price - 10)} is minimum needed to run household.`;
        }
        
        if (playerInput.includes('job') || playerInput.includes('work') || playerInput.includes('office')) {
            return `Work is important sir! Don't be late for boss. ₹${price} will get you there quickly and safely.`;
        }
        
        if (playerInput.includes('hospital') || playerInput.includes('emergency') || playerInput.includes('urgent')) {
            return `Emergency? Then we must go fast! ₹${Math.max(fairPrice, price - 5)} and I'll take quickest route.`;
        }
        
        // Compliments and flattery
        if (playerInput.includes('nice auto') || playerInput.includes('clean') || playerInput.includes('good driver')) {
            return `Thank you sir! I maintain my auto very well. For appreciative customer like you, ₹${Math.max(fairPrice, price - 12)} special rate!`;
        }
        
        // Questions about the driver
        if (playerInput.includes('how long') && playerInput.includes('driving')) {
            return `I'm driving auto for 15 years sir! Know all routes in Kerala. Experience costs ₹${price} - you get safe journey guaranteed!`;
        }
        
        if (playerInput.includes('from where') || playerInput.includes('which place')) {
            return `I'm from Ernakulam itself sir, born and brought up here. Local driver means no cheating - ₹${price} is honest rate.`;
        }
        
        // No direct response needed, use pool-based system
        return null;
    }

    buildResponsePool(analysis, context) {
        const responses = [];
        
        // Strategy-specific responses
        switch (analysis.strategy) {
            case 'walk_away':
                if (this.currentStrategy === 'panic') {
                    responses.push(
                        "Ayyyo sir! Don't go! Okay okay, ₹{price} final price!",
                        "Wait wait! Let's discuss properly. ₹{price} is reasonable, no?",
                        "Sir sir! Come back! For you special rate ₹{price}!",
                        "Don't walk in this heat! ₹{price} and we have deal!"
                    );
                } else {
                    responses.push(
                        "Go ahead sir, other drivers will charge double!",
                        "No problem, plenty customers waiting at airport.",
                        "₹{price} is fixed rate. Take it or leave it.",
                        "Good luck finding cheaper rate in this area!"
                    );
                }
                break;
                
            case 'cultural':
                if (this.location.name.includes('Uncle')) {
                    responses.push(
                        "Ayyye, you are good family person! For you ₹{price} only.",
                        "Your father taught you well - respecting elders! ₹{price} is fair.",
                        "Beta, family discount applies. ₹{price} is minimum for me.",
                        "You speak like proper Malayalam person! ₹{price} final rate."
                    );
                } else {
                    responses.push(
                        "Good, you know local culture! ₹{price} is standard rate.",
                        "Malayalam speaking? Then you understand ₹{price} is fair price.",
                        "Local person will not cheat local person. ₹{price} correct rate.",
                        "You are like brother to me! ₹{price} is friendship rate."
                    );
                }
                break;
                
            case 'logical':
                responses.push(
                    "Sir, meter shows ₹{price} plus waiting time and petrol cost.",
                    "Distance wise calculation: ₹{price} is accurate rate.",
                    "Government rate is ₹{price} for this route during {round} time.",
                    "Mathematically speaking, ₹{price} covers all expenses properly."
                );
                break;
                
            case 'aggressive':
                if (this.profile.personality.patience < 0.5) {
                    responses.push(
                        "Why are you shouting? ₹{price} is final rate!",
                        "Demanding will not reduce price! ₹{price} only!",
                        "Other customers are waiting! ₹{price} or find another auto!",
                        "No point arguing! Government fixed rate is ₹{price}!"
                    );
                } else {
                    responses.push(
                        "I understand you are upset, but ₹{price} is fair rate.",
                        "Please calm down sir. ₹{price} is reasonable for everyone.",
                        "Let's discuss politely. ₹{price} includes all charges.",
                        "No need to be angry. ₹{price} is standard rate."
                    );
                }
                break;
                
            default:
                responses.push(
                    "₹{price} is very reasonable rate for this distance.",
                    "Considering traffic and petrol price, ₹{price} is minimum.",
                    "Other drivers charge more! ₹{price} is good deal for you.",
                    "Fair price for fair service! ₹{price} is correct rate."
                );
        }
        
        // Add mood-influenced responses
        if (context.mood === 'happy') {
            responses.push(
                "😊 Today is good day! ₹{price} and both of us will be happy!",
                "You are very nice person to talk with! ₹{price} is friendship rate!",
                "Good negotiation makes good business! ₹{price} works for both!"
            );
        } else if (context.mood === 'annoyed') {
            responses.push(
                "😤 Too much talking! ₹{price} is final rate!",
                "Why waste time? ₹{price} is standard rate everywhere!",
                "Other customers don't argue so much! ₹{price} only!"
            );
        }
        
        return responses;
    }

    enhanceAIResponse(aiText, analysis, context) {
        // Add location-specific flavor
        if (this.location.name.includes('Airport') && Math.random() > 0.7) {
            aiText += " Airport has special charges, you know.";
        } else if (this.location.name.includes('Uncle') && Math.random() > 0.6) {
            aiText += " For good family, I always give best rate!";
        }
        
        // Add personality-based speech patterns
        if (this.profile.personality.humor > 0.7 && Math.random() > 0.8) {
            const jokes = [
                " Life is like auto meter - sometimes fair, sometimes broken! 😄",
                " In Kerala, even coconuts negotiate their price! 🥥",
                " Auto driving taught me patience - and you are testing it! 😅"
            ];
            aiText += jokes[Math.floor(Math.random() * jokes.length)];
        }
        
        return aiText;
    }

    addPersonalityTouch(response, context) {
        // Add emotional indicators based on mood
        const moodEmojis = {
            'happy': ['😊', '🙂', '😄'],
            'neutral': ['😐', '🤔'],
            'annoyed': ['😤', '😑', '🙄'],
            'angry': ['😠', '😡']
        };
        
        if (Math.random() > 0.6 && moodEmojis[context.mood]) {
            const emojis = moodEmojis[context.mood];
            response = emojis[Math.floor(Math.random() * emojis.length)] + ' ' + response;
        }
        
        // Add local expressions
        if (Math.random() > 0.8) {
            const expressions = ['Ayyyo!', 'What to do?', 'Like this only!', 'God knows!'];
            response = expressions[Math.floor(Math.random() * expressions.length)] + ' ' + response;
        }
        
        return response;
    }

    categorizeResponse(response) {
        if (response.includes('Don\'t go') || response.includes('Wait')) return 'panic';
        if (response.includes('family') || response.includes('local')) return 'cultural';
        if (response.includes('meter') || response.includes('distance')) return 'logical';
        if (response.includes('😊') || response.includes('good day')) return 'happy';
        if (response.includes('😤') || response.includes('waste time')) return 'annoyed';
        return 'general';
    }

    trackResponseType(response) {
        const responseType = this.categorizeResponse(response);
        this.lastResponseTypes.push(responseType);
        
        // Keep only last 3 response types to allow some repetition but not immediate
        if (this.lastResponseTypes.length > 3) {
            this.lastResponseTypes.shift();
        }
    }

    calculateMoodChange(analysis, context) {
        let moodChange = 0;
        
        // Sentiment impact
        if (analysis.sentiment === 'positive') moodChange += 1;
        if (analysis.sentiment === 'negative') moodChange -= 1;
        
        // Respect level impact
        if (analysis.respectLevel === 'high') moodChange += 0.5;
        if (analysis.respectLevel === 'low') moodChange -= 1;
        
        // Cultural sensitivity impact
        if (analysis.culturalMarkers.malayalam.length > 0) moodChange += 0.5;
        
        // Strategy impact
        if (analysis.strategy === 'walk_away') moodChange -= 0.5;
        if (analysis.strategy === 'flattery') moodChange += 0.5;
        
        // Time pressure - long negotiations can be tiring
        if (context.round > 5) moodChange -= 0.2;
        
        return moodChange;
    }

    generateDriverThoughts(analysis, context) {
        // Internal monologue for debugging/flavor
        const thoughts = [];
        
        if (this.playerProfileEstimate.isLocal) {
            thoughts.push("This person seems to know local rates...");
        }
        
        if (this.playerProfileEstimate.negotiationSkill > 5) {
            thoughts.push("Good negotiator! Must be careful with pricing.");
        }
        
        if (analysis.strategy === 'walk_away') {
            thoughts.push("Bluffing or serious? Hard to tell...");
        }
        
        return thoughts.join(' ');
    }

    getTimeOfDayMood() {
        const hour = new Date().getHours();
        if (hour < 6 || hour > 22) return -0.2; // Very early/late - tired
        if (hour >= 6 && hour < 10) return 0.1; // Morning - fresh
        if (hour >= 10 && hour < 14) return 0.0; // Midday - normal
        if (hour >= 14 && hour < 18) return -0.1; // Afternoon - slightly tired
        if (hour >= 18 && hour < 22) return 0.05; // Evening - winding down
        return 0;
    }

    // Reset for new game
    reset() {
        this.negotiationMemory = [];
        this.conversationTurn = 0;
        this.lastResponseTypes = [];
        this.priceHistory = [];
        this.currentStrategy = this.selectInitialStrategy();
        this.playerProfileEstimate = {
            isLocal: false,
            culturalAwareness: 0,
            negotiationSkill: 0,
            politeness: 0,
            patience: 5,
            priceFlexibility: 5
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedDriverAI;
}

// Make available globally
window.AdvancedDriverAI = AdvancedDriverAI; 