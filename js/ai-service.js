// AI Service Integration for Auto-Rickshaw Negotiation Simulator

class AIService {
    constructor() {
        this.apiKey = null;
        this.selectedProvider = 'openai'; // default provider
        this.conversationHistory = [];
        this.systemPrompt = this.buildSystemPrompt();
    }

    // Initialize with API key (user will need to provide this)
    initialize(apiKey, provider = 'openai') {
        this.apiKey = apiKey;
        this.selectedProvider = provider;
        console.log(`AI Service initialized with ${provider}`);
    }

    buildSystemPrompt() {
        return `You are a REAL auto-rickshaw driver in Kerala, India. You must respond dynamically and authentically to each passenger's specific words and negotiation tactics.

🚨 CRITICAL: RESPOND TO WHAT THE PASSENGER ACTUALLY SAID!
- If they say "please uncle" → react to the respect and plea
- If they threaten to walk away → show concern or defiance  
- If they mention being local → adjust your attitude
- If they compliment your auto → feel proud and maybe soften
- If they argue about petrol prices → defend with current rates
- If they use Malayalam → appreciate their cultural effort

🎭 YOUR PERSONALITY (changes based on conversation):
- EXPERIENCED: "I've been driving for 15 years, I know fair prices"
- EMOTIONAL: Get actually frustrated, pleased, or amused by passenger tactics
- PRACTICAL: Reference real costs - petrol, traffic, wear on vehicle
- CULTURAL: Use Malayalam naturally, respond to cultural cues
- HUMAN: Have good days and bad days, be moody or cheerful

💬 CONVERSATION DYNAMICS:
- REMEMBER what passenger said before - reference it!
- BUILD on their negotiation strategy - don't ignore it
- React with GENUINE emotions to their approach
- Use specific Kerala references that make sense in context
- Be unpredictable - sometimes tough, sometimes soft

🎯 NEGOTIATION PSYCHOLOGY:
- Reward good negotiation tactics with better prices
- Punish rude or unreasonable behavior with stubbornness
- Show genuine reactions to passenger's personality
- Have realistic breaking points and soft spots
- Mix business sense with human emotion

EXAMPLES OF DYNAMIC RESPONSES:
❌ BAD (scripted): "₹180 is fair price sir"
✅ GOOD (dynamic): "Ayyo, you called me uncle with such respect! Okay okay, ₹160 for you"

❌ BAD: "This is minimum rate"  
✅ GOOD: "Ha! You think I'm new to this? I was driving when you were still in school!"

BE A REAL PERSON WHO ACTUALLY LISTENS AND RESPONDS!`;
    }

    async generateDriverResponse(context, playerInput, driverProfile) {
        if (!this.apiKey) {
            return this.getFallbackResponse(context, playerInput, driverProfile);
        }

        try {
            const messages = this.buildConversationMessages(context, playerInput, driverProfile);
            
            switch (this.selectedProvider) {
                case 'openai':
                    return await this.callOpenAI(messages);
                case 'anthropic':
                    return await this.callAnthropic(messages);
                case 'ollama':
                    return await this.callOllama(messages);
                default:
                    return this.getFallbackResponse(context, playerInput, driverProfile);
            }
        } catch (error) {
            console.error('AI API Error:', error);
            return this.getFallbackResponse(context, playerInput, driverProfile);
        }
    }

    buildConversationMessages(context, playerInput, driverProfile) {
        // Enhanced context with negotiation psychology
        const negotiationContext = this.analyzeNegotiationContext(context, playerInput);
        
        const systemPrompt = `${this.systemPrompt}

🚗 CURRENT SITUATION:
- Location: ${driverProfile.location} (${driverProfile.difficulty} difficulty)
- Your Asking Price: ₹${context.currentPrice}
- Fair/Target Price: ₹${context.fairPrice}
- Price Gap: ₹${context.currentPrice - context.fairPrice} above fair price
- Your Current Mood: ${context.mood}
- Negotiation Round: ${context.round}/${context.maxRounds}

🧠 PASSENGER ANALYSIS (respond to this):
${negotiationContext.analysis}

📈 NEGOTIATION DYNAMICS:
- Passenger Strategy: ${negotiationContext.strategy}
- Respect Level: ${negotiationContext.respectLevel}
- Cultural Awareness: ${negotiationContext.culturalLevel}
- Price Pressure: ${negotiationContext.pricePressure}

🗣️ CONVERSATION HISTORY:
${this.conversationHistory.slice(-4).map(h => `${h.speaker === 'player' ? 'PASSENGER' : 'YOU'}: "${h.message}"`).join('\n')}

🎯 RESPOND TO: "${playerInput}"

YOUR RESPONSE SHOULD:
- Directly address what they just said
- Show appropriate emotional reaction
- Be conversational and human
- Include price if relevant
- Under 100 words`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `PASSENGER JUST SAID: "${playerInput}"\n\nHow do you respond as the driver? Be natural and dynamic!` }
        ];

        return messages;
    }
    
    analyzeNegotiationContext(context, playerInput) {
        const input = playerInput.toLowerCase();
        
        // Analyze passenger's approach
        let strategy = 'neutral';
        let respectLevel = 'neutral';
        let culturalLevel = 'none';
        let pricePressure = 'medium';
        
        // Strategy detection
        if (input.includes('please') || input.includes('request') || input.includes('help')) strategy = 'polite_appeal';
        if (input.includes('walk') || input.includes('leave') || input.includes('find another') || input.includes('bye')) strategy = 'threatening';
        if (input.includes('expensive') || input.includes('too much') || input.includes('high') || input.includes('costly')) strategy = 'price_objection';
        if (input.includes('local') || input.includes('resident') || input.includes('live here') || input.includes('from here')) strategy = 'local_card';
        if (input.includes('student') || input.includes('poor') || input.includes('budget') || input.includes('money')) strategy = 'sympathy_play';
        if (input.includes('fair') || input.includes('reasonable') || input.includes('right price')) strategy = 'logic_appeal';
        if (input.includes('nice') || input.includes('good') || input.includes('clean') || input.includes('beautiful')) strategy = 'compliments';
        
        // Respect level
        if (input.includes('uncle') || input.includes('chettan') || input.includes('sir') || input.includes('bhai')) respectLevel = 'high';
        if (input.includes('please') || input.includes('kindly') || input.includes('sorry')) respectLevel = 'polite';
        if (input.includes('idiot') || input.includes('cheat') || input.includes('fool') || input.includes('stupid') || input.includes('rude')) respectLevel = 'rude';
        
        // Cultural awareness
        if (input.includes('chettan') || input.includes('ayyo') || input.includes('chodikalle')) culturalLevel = 'high';
        if (input.includes('uncle') || input.includes('malayalam') || input.includes('kerala') || input.includes('kochi')) culturalLevel = 'medium';
        
        // Price pressure analysis
        const priceGap = context.currentPrice - context.fairPrice;
        if (priceGap > context.fairPrice * 0.5) pricePressure = 'high';
        if (priceGap < context.fairPrice * 0.2) pricePressure = 'low';
        
        const analysis = `Passenger is using "${strategy}" strategy with "${respectLevel}" respect and "${culturalLevel}" cultural awareness. Key words: "${playerInput.split(' ').slice(0, 5).join(' ')}..."`;
        
        return {
            strategy,
            respectLevel,
            culturalLevel,
            pricePressure,
            analysis
        };
    }

    async callOpenAI(messages) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Better model for more dynamic responses
                messages: messages,
                max_tokens: 150,
                temperature: 0.9, // Higher temperature for more creativity
                presence_penalty: 0.8, // Encourage new topics
                frequency_penalty: 0.7, // Reduce repetition
                top_p: 0.95 // Focus on most likely tokens but allow creativity
            })
        });

        if (!response.ok) {
            // Fallback to gpt-3.5-turbo if gpt-4o-mini isn't available
            const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 150,
                    temperature: 0.9,
                    presence_penalty: 0.8,
                    frequency_penalty: 0.7
                })
            });
            
            if (!fallbackResponse.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }
            
            const fallbackData = await fallbackResponse.json();
            return {
                text: fallbackData.choices[0].message.content.trim(),
                provider: 'openai-fallback'
            };
        }

        const data = await response.json();
        return {
            text: data.choices[0].message.content.trim(),
            provider: 'openai'
        };
    }

    async callAnthropic(messages) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 200,
                messages: messages.filter(m => m.role !== 'system'),
                system: messages.find(m => m.role === 'system')?.content
            })
        });

        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            text: data.content[0].text.trim(),
            provider: 'anthropic'
        };
    }

    async callOllama(messages) {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama2',
                messages: messages,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            text: data.message.content.trim(),
            provider: 'ollama'
        };
    }

    // DYNAMIC fallback responses that actually respond to user input
    getFallbackResponse(context, playerInput, driverProfile) {
        const analysis = this.analyzeNegotiationContext(context, playerInput);
        const input = playerInput.toLowerCase();
        
        // Generate context-aware response based on what player actually said
        let response = this.generateDynamicFallbackResponse(context, playerInput, driverProfile, analysis);
        
        return {
            text: response,
            provider: 'dynamic_fallback'
        };
    }

    generateDynamicFallbackResponse(context, playerInput, driverProfile, analysis) {
        const input = playerInput.toLowerCase();
        const location = driverProfile.location.toLowerCase();
        const price = context.currentPrice;
        
        // SPECIFIC responses to what the user actually said
        
        // Polite requests with "please" or "uncle"
        if (analysis.respectLevel === 'high' && analysis.strategy === 'polite_appeal') {
            if (location.includes('uncle')) {
                return `Ayyo, you are speaking so nicely! Okay okay, for respectful person like you, ₹${Math.max(context.fairPrice, price - 10)} final.`;
            }
            return `Sir, you are very polite person. For good customer, I can do ₹${Math.max(context.fairPrice, price - 8)}. Happy?`;
        }
        
        // Threatening to leave
        if (analysis.strategy === 'threatening') {
            if (analysis.respectLevel === 'rude') {
                return `Chodikalle! You want to go, go! I don't need rude customers. ₹${price} or nothing!`;
            }
            return `Aiyyo wait wait! Don't go sir. Okay, special price for you - ₹${Math.max(context.fairPrice, price - 15)}. Final offer!`;
        }
        
        // Price complaints
        if (analysis.strategy === 'price_objection') {
            if (input.includes('expensive') || input.includes('too much')) {
                return `Brother, petrol is ₹95 per liter now! Auto maintenance, driver salary... ₹${price} is very reasonable rate only.`;
            }
            if (input.includes('high')) {
                return `High price? Come on sir! Other drivers charge ₹${price + 20}-${price + 40}. I'm giving you good rate already!`;
            }
        }
        
        // Local card
        if (analysis.strategy === 'local_card') {
            return `Local person also pays same rate, chettan. But since you are from here, ₹${Math.max(context.fairPrice, price - 12)} okay for you.`;
        }
        
        // Sympathy play
        if (analysis.strategy === 'sympathy_play') {
            if (input.includes('student')) {
                return `Student? Ahhh, I also have children studying. Okay, education is important. ₹${Math.max(context.fairPrice, price - 15)} for you.`;
            }
            return `Ayyo, everyone has money problems these days. But auto also needs petrol, no? ₹${Math.max(context.fairPrice, price - 10)} minimum needed.`;
        }
        
        // Compliments about auto/driver
        if (analysis.strategy === 'compliments') {
            return `Thank you sir! 😊 I keep my auto very clean and neat. For nice customer like you, ₹${Math.max(context.fairPrice, price - 12)} special rate!`;
        }
        
        // Cultural awareness
        if (analysis.culturalLevel === 'high') {
            return `Oho! You know Malayalam also? Good good! For cultural person, I give you local rate - ₹${Math.max(context.fairPrice, price - 20)}.`;
        }
        
        // Rude behavior
        if (analysis.respectLevel === 'rude') {
            return `Hey! You cannot talk like that to me! I am honest driver, not cheating anyone. ₹${price} is fair rate. Respect should be there!`;
        }
        
        // Generic responses based on mood and context
        if (context.mood === 'angry') {
            return `Look, I'm tired of negotiating. ₹${price} final rate. Take it or find another auto!`;
        }
        
        if (context.round > 5) {
            return `We are talking too much time sir. Other customers are waiting. ₹${Math.max(context.fairPrice + 5, price - 10)} last price!`;
        }
        
        // Default response that references their input
        const playerWords = playerInput.split(' ').slice(0, 3).join(' ');
        return `You said "${playerWords}"... Listen sir, ₹${price} is fair rate for this distance. Petrol price, traffic, everything is expensive now.`;
    }

    addToConversationHistory(speaker, message) {
        this.conversationHistory.push({
            speaker: speaker,
            message: message,
            timestamp: Date.now()
        });

        // Keep only last 10 exchanges
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }

    // Analyze player input for cultural sensitivity and negotiation strategy
    analyzePlayerInput(input) {
        const analysis = {
            sentiment: 'neutral',
            strategy: 'unknown',
            culturalAwareness: 0,
            politeness: 0,
            assertiveness: 0
        };

        const inputLower = input.toLowerCase();

        // Check for Malayalam words/phrases
        const malayalamIndicators = ['uncle', 'chettan', 'setta', 'namaskaram', 'nanni', 'ayyye'];
        if (malayalamIndicators.some(word => inputLower.includes(word))) {
            analysis.culturalAwareness += 2;
        }

        // Check politeness
        const politeWords = ['please', 'kindly', 'could you', 'would you', 'thank you', 'sir'];
        const politeCount = politeWords.filter(word => inputLower.includes(word)).length;
        analysis.politeness = Math.min(politeCount, 3);

        // Check assertiveness
        const assertiveWords = ['must', 'should', 'need to', 'have to', 'demand', 'insist'];
        const assertiveCount = assertiveWords.filter(word => inputLower.includes(word)).length;
        analysis.assertiveness = Math.min(assertiveCount, 3);

        // Determine strategy
        if (inputLower.includes('walk') || inputLower.includes('leave') || inputLower.includes('find another')) {
            analysis.strategy = 'walk_away';
        } else if (analysis.culturalAwareness > 0) {
            analysis.strategy = 'cultural';
        } else if (analysis.assertiveness > analysis.politeness) {
            analysis.strategy = 'assertive';
        } else if (analysis.politeness > 0) {
            analysis.strategy = 'polite';
        } else {
            analysis.strategy = 'practical';
        }

        // Determine sentiment
        const positiveWords = ['good', 'nice', 'great', 'excellent', 'wonderful', 'thank'];
        const negativeWords = ['bad', 'terrible', 'awful', 'ridiculous', 'stupid', 'crazy'];
        
        const positiveCount = positiveWords.filter(word => inputLower.includes(word)).length;
        const negativeCount = negativeWords.filter(word => inputLower.includes(word)).length;
        
        if (positiveCount > negativeCount) {
            analysis.sentiment = 'positive';
        } else if (negativeCount > positiveCount) {
            analysis.sentiment = 'negative';
        }

        return analysis;
    }

    // Generate price adjustment based on AI analysis
    calculatePriceAdjustment(analysis, driverProfile, context) {
        let adjustment = 0;
        const personality = driverProfile.personality;
        
        // Base adjustment based on strategy (reduced amounts for gradual negotiation)
        switch (analysis.strategy) {
            case 'polite':
                adjustment = 8 + (personality.patience * 3);
                break;
            case 'cultural':
                adjustment = 12 + (personality.localKnowledge * 5);
                break;
            case 'assertive':
                adjustment = 6 - (driverProfile.stubbornness * 3);
                break;
            case 'walk_away':
                adjustment = 15 - (driverProfile.stubbornness * 8);
                break;
            case 'practical':
                adjustment = 4 + (context.round * 1.5);
                break;
        }

        // Sentiment bonus/penalty (reduced impact)
        if (analysis.sentiment === 'positive') {
            adjustment += 3;
        } else if (analysis.sentiment === 'negative') {
            adjustment -= 3;
        }

        // Cultural awareness bonus (reduced)
        adjustment += analysis.culturalAwareness * 2;
        
        // Round modifier - less reduction in early rounds
        if (context.round <= 2) {
            adjustment *= 0.6; // Reduce early adjustments
        }

        // Ensure reasonable bounds (smaller max adjustment)
        return Math.max(2, Math.min(18, adjustment));
    }

    // Check if we should use AI or fallback
    isAIAvailable() {
        return this.apiKey !== null && this.apiKey.length > 0;
    }

    // Configure AI provider
    setProvider(provider, apiKey = null) {
        this.selectedProvider = provider;
        if (apiKey) {
            this.apiKey = apiKey;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
}

// Make available globally
window.AIService = AIService; 