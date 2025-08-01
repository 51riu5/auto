# 🛺 Auto-Rickshaw Negotiation Simulator

A hilarious and educational VR experience where you practice haggling with auto drivers in various Kerala locations. Master the art of fare negotiation from "Kochi Airport" (Nightmare Mode) to "Local Uncle Who Knows Your Family" (Easy Mode)!

## 🎮 Game Features

### 🏞️ Authentic Kerala Locations
- **🛫 Kochi Airport** - Nightmare Mode: Tourist trap central with premium pricing
- **🚂 Ernakulam Railway Station** - Hard Mode: Experienced drivers with all the tricks
- **🏪 Broadway Market** - Medium Mode: Local market where negotiation is expected
- **🏘️ Residential Area** - Easy Mode: Reasonable neighborhood drivers
- **👨‍🦳 Local Uncle's Auto** - Tutorial Mode: Uncle Ravi knows your family (but still negotiates!)

### 🎯 Core Gameplay
- **🤖 AI-Powered Conversations** - Type naturally and get intelligent, contextual responses (OpenAI/Ollama supported)
- **🏛️ Cultural Authenticity** - Malayalam phrases, local customs, and genuine Kerala experience
- **💬 Natural Text Input** - No more button clicking - have real conversations with drivers
- **🧠 Smart Analysis** - AI analyzes your politeness, cultural awareness, and negotiation strategy
- **💰 Dynamic Pricing** - Prices adjust based on your conversation skills and cultural sensitivity
- **📊 Advanced Scoring** - Earn points for savings, cultural points, efficiency, and driver happiness

### 🥽 VR Experience
- **WebVR Compatible** - Works with Oculus Quest, Rift, HTC Vive, and mobile VR
- **3D Auto-Rickshaw** - Detailed vehicle with animated driver
- **Immersive Environments** - Different Kerala settings with day/night cycles
- **Desktop Fallback** - Full experience available without VR headset

### 🏛️ Cultural Learning
- **Malayalam Integration** - Learn basic negotiation phrases
- **Local Customs** - Understand Kerala hospitality and business culture
- **Insider Tips** - Real-world advice for auto negotiations
- **Respectful Approach** - Emphasizes mutual respect and fair dealing

## 🚀 Quick Start

### Prerequisites
- Modern web browser with WebGL support
- VR headset (optional - works on desktop/mobile too)
- Python 3.x or Node.js (for local server)

### Installation & Setup

1. **Clone or Download** the project files to your computer

2. **Start a Local Server** (required for VR features):

   **Option A: Using Python**
   ```bash
   # Navigate to project directory
   cd auto-rickshaw-negotiation-simulator
   
   # Start server
   python -m http.server 8000
   ```

   **Option B: Using Node.js**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

   **Option C: Using npx (no installation)**
   ```bash
   npx serve .
   ```

3. **Open in Browser**
   - Go to `http://localhost:8000` (or the port shown in terminal)
   - Allow VR permissions if prompted
   - Configure AI service (see below)
   - Enjoy haggling!

## 🤖 AI Configuration (Enhanced Experience)

For the **best experience**, configure an AI service for dynamic conversations:

### 🎯 Recommended: OpenAI
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys) (~$0.002 per game)
2. Enter your key when prompted in the app
3. Enjoy natural, intelligent conversations!

### 🏠 Free Alternative: Local Ollama
1. Install [Ollama](https://ollama.ai/) and run `ollama pull llama2`
2. Start with `ollama serve`
3. Select "Local Ollama" in app

### 🔄 No Setup: Fallback Mode
- Uses pre-written responses (still fun!)
- No API keys needed
- Works offline

**📖 Full AI Setup Guide**: See [AI_SETUP.md](AI_SETUP.md) for detailed instructions.

## 🎮 How to Play

### 🎯 Objective
Negotiate the best possible fare while maintaining respect and cultural sensitivity. Your score depends on:
- **Money Saved** - How much you reduce from the initial price
- **Cultural Points** - Using Malayalam phrases and showing cultural awareness
- **Efficiency** - Reaching a deal in fewer rounds
- **Driver Mood** - Keeping the driver happy or at least neutral

### 🎪 Game Flow
1. **Choose Location** - Select your challenge level
2. **Configure AI** - Set up OpenAI, Ollama, or use fallback mode
3. **Enter VR** - Put on headset or play on desktop
4. **Listen to Driver** - Each has unique personality and pricing
5. **Type Response** - Have natural conversations in text
6. **Watch AI React** - Driver mood and price change based on your conversation
7. **Reach Agreement** - Negotiate until you find a fair deal
8. **Get Scored** - Receive detailed feedback and tips

### 🎯 Winning Strategies

**🙏 Polite Approach**
- Use respectful language and Malayalam phrases
- Build rapport before discussing price
- Works well with patient, friendly drivers

**💪 Assertive Method**
- Know your local rates and stand firm
- Reference meter rates and official charts
- Effective with stubborn but reasonable drivers

**🏛️ Cultural Connection**
- Mention local family or connections
- Use Kerala cultural references
- Especially powerful with "Uncle" character

**🚶 Walking Away**
- Sometimes the best negotiation tool
- Effective late in negotiation
- High risk, high reward strategy

### 📱 Controls
- **Text Input**: Type your responses naturally in the chat box
- **Suggestion Chips**: Click quick-response buttons for common phrases
- **VR Mode**: Use controllers or gaze cursor for UI interaction
- **Desktop**: Keyboard and mouse for typing and navigation
- **Mobile**: Touch keyboard for text input and touch interface

## 🏗️ Technical Details

### 🛠️ Built With
- **A-Frame** - WebVR framework for 3D/VR experiences
- **Vanilla JavaScript** - No frameworks, pure JS for maximum compatibility
- **CSS3** - Modern styling with animations and responsive design
- **HTML5** - Semantic markup and web standards

### 📂 Project Structure
```
auto-rickshaw-negotiation-simulator/
├── index.html              # Main VR application
├── css/
│   └── style.css           # UI styling and animations
├── js/
│   ├── game.js             # Core game logic and AI
│   ├── locations.js        # Kerala locations and difficulty settings
│   └── phrases.js          # Malayalam phrases and cultural context
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### 🌐 Browser Compatibility
- **Chrome/Edge** - Full VR support
- **Firefox** - WebVR enabled by default
- **Safari** - Limited VR, full desktop experience
- **Mobile Browsers** - Works with device orientation

## 🎓 Educational Value

### 🏛️ What You'll Learn
- **Kerala Culture** - Local customs, hospitality, and business practices
- **Malayalam Basics** - Essential phrases for auto negotiations
- **Negotiation Skills** - Real-world bargaining techniques
- **Cultural Sensitivity** - Respectful interaction with service providers
- **Local Economics** - Understanding fair pricing and driver perspectives

### 🎯 Learning Outcomes
- Improved negotiation confidence in real Kerala auto rides
- Better cultural understanding and sensitivity
- Basic Malayalam vocabulary for travel
- Appreciation for auto driver challenges and perspectives

## 🛺 Character Profiles

### 😠 Airport Driver (Nightmare Mode)
- **Personality**: Impatient, money-focused, tourist-wary
- **Strategy**: Overcharge tourists, use excuses for premium pricing
- **Weakness**: Walking away, official rate references
- **Challenge**: Extremely stubborn, low cultural sensitivity

### 🚂 Railway Station Driver (Hard Mode)
- **Personality**: Experienced, professional, slightly greedy
- **Strategy**: Standard overcharging with logical explanations
- **Weakness**: Local knowledge, practical comparisons
- **Challenge**: Knows most tricks, harder to fool

### 🏪 Market Driver (Medium Mode)
- **Personality**: Friendly but business-minded
- **Strategy**: Moderate overcharging, open to negotiation
- **Weakness**: Regular customer approach, cultural connections
- **Challenge**: Balanced difficulty, good for learning

### 🏘️ Residential Driver (Easy Mode)
- **Personality**: Local-friendly, reasonable, patient
- **Strategy**: Fair pricing with minor markup
- **Weakness**: Politeness, local references
- **Challenge**: Good for beginners, teaches basics

### 👨‍🦳 Uncle Ravi (Tutorial Mode)
- **Personality**: Family-oriented, teaching, humorous
- **Strategy**: Gentle negotiation with cultural lessons
- **Weakness**: Family connections, respectful approach
- **Special**: Gives advice, teaches Malayalam, cultural tips

## 🎨 Customization & Modding

The game is built with modular JavaScript, making it easy to:
- Add new locations and difficulty levels
- Include more Malayalam phrases and cultural contexts
- Modify driver personalities and behaviors
- Adjust pricing algorithms and negotiation mechanics
- Add seasonal events or special scenarios

## 🤝 Contributing

We welcome contributions to make this experience more authentic and educational!

### 💡 Ways to Contribute
- **Cultural Accuracy**: Improve Malayalam translations and cultural details
- **New Locations**: Add more Kerala destinations with unique characteristics
- **Driver Personalities**: Create more diverse and realistic character types
- **Negotiation Strategies**: Add advanced tactics and responses
- **VR Enhancements**: Improve 3D models, environments, and interactions

### 🐛 Bug Reports
If you find issues or have suggestions, please:
1. Check existing issues first
2. Provide detailed reproduction steps
3. Include browser/device information
4. Suggest potential solutions if possible

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Kerala Auto Drivers** - For inspiration and authentic experiences
- **Malayalam Community** - For language guidance and cultural insights
- **A-Frame Community** - For the amazing WebVR framework
- **Kerala Tourism** - For promoting "God's Own Country"

## 🎮 Play Now!

Ready to test your haggling skills? Start the server and dive into the wonderful world of Kerala auto-rickshaw negotiations!

**Remember**: The goal isn't just to save money, but to do so respectfully while learning about Kerala's rich culture. Happy negotiating! 🛺✨

---

*"In Kerala, every auto ride is an adventure, and every negotiation is a cultural exchange!"* 