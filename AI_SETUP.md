# 🤖 AI Integration Setup Guide

The Auto-Rickshaw Negotiation Simulator now features **AI-powered dynamic conversations**! Instead of pre-defined button responses, you can type naturally and get intelligent, contextual responses from the auto drivers.

## 🚀 Quick Start Options

### Option 1: OpenAI (Recommended) 🎯
**Best experience with GPT-3.5/GPT-4**

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. When you first run the app, enter your API key in the configuration modal
3. Enjoy natural, dynamic conversations!

**Cost**: ~$0.002 per conversation (very affordable)

### Option 2: Local AI (Ollama) 🏠
**Free and private - runs on your computer**

1. Install [Ollama](https://ollama.ai/)
2. Download a model: `ollama pull llama2`
3. Start Ollama: `ollama serve`
4. Select "Local Ollama" in the app configuration

**Requirements**: 8GB+ RAM, modern CPU

### Option 3: Fallback Mode 🔄
**Works without any setup - uses pre-written responses**

1. Select "Fallback Mode" in the configuration
2. Still fun and educational, just less dynamic
3. No API keys or installation needed

## 🎮 How the AI Experience Works

### Dynamic Conversations
- **Type naturally**: "Uncle, can you reduce the price a bit?"
- **Cultural awareness**: AI recognizes Malayalam phrases and cultural references
- **Personality-driven**: Each location has unique driver personalities
- **Contextual**: Responses change based on your negotiation history

### Smart Analysis
The AI analyzes your input for:
- **Politeness level**: "Please" vs "I demand"
- **Cultural sensitivity**: Using "Uncle", "Chettan", Malayalam phrases
- **Negotiation strategy**: Walking away, being practical, leveraging connections
- **Sentiment**: Positive, neutral, or negative tone

### Realistic Pricing
- Prices adjust based on your negotiation skills
- Better cultural awareness = better deals
- Driver mood affects their willingness to negotiate
- Each location has realistic pricing constraints

## 🎯 Pro Tips for Best AI Experience

### With OpenAI:
```
✅ "Chettan, petrol price is high, but ₹200 seems too much for this distance"
✅ "Uncle, I'm a local person. Can you give me a fair rate?"
✅ "I understand you need to make money, but what about ₹150?"
```

### Cultural Phrases That Work:
- **"Uncle"** / **"Chettan"** - Respectful address
- **"Setta, konjam kurayikamo?"** - "Brother, can you reduce?"
- **"Namaskaram"** - Formal greeting
- **"Fair price parayamo?"** - "Can you tell fair price?"

### Negotiation Strategies:
1. **Start polite**: Build rapport first
2. **Show local knowledge**: Mention you know the area
3. **Be reasonable**: Don't lowball immediately  
4. **Use cultural connection**: "My family lives here"
5. **Walk away threat**: Use sparingly but effectively

## 🔧 Technical Details

### API Usage
- **OpenAI**: Uses GPT-3.5-turbo (~200 tokens per response)
- **Cost per game**: $0.002-0.005 (very affordable)
- **Response time**: 1-3 seconds

### Local Ollama
- **Model**: Llama2 7B (recommended) or others
- **RAM usage**: 4-8GB during inference
- **Response time**: 3-10 seconds depending on hardware

### Fallback Mode
- **Pre-written responses**: 100+ contextual responses
- **No internet required**: Works completely offline
- **Instant responses**: No delays

## 🛠️ Troubleshooting

### OpenAI Issues
- **Invalid API Key**: Double-check your key from OpenAI dashboard
- **Rate Limits**: Wait a minute and try again
- **Network Error**: Check internet connection

### Ollama Issues
- **Connection Failed**: Ensure `ollama serve` is running
- **Model Not Found**: Run `ollama pull llama2`
- **Slow Responses**: Consider upgrading hardware or using smaller model

### General Issues
- **Text not showing**: Try refreshing the page
- **Input not working**: Click on the text input field
- **VR not working**: Try desktop mode first

## 🎭 Sample Conversations

### Airport (Nightmare Mode)
```
Driver: "Sir, airport rate is different. Minimum ₹500 only!"
You: "Uncle, I know airport has premium, but ₹500 seems too high. What about ₹300?"
Driver: "Ayyyo sir, parking fee, waiting charge, airport tax - all included! ₹450 is final price."
You: "I understand your costs, but I can walk to the prepaid counter. ₹350?"
Driver: "Okay okay, you seem like good person. ₹400 final. Deal?"
```

### Uncle Mode (Tutorial)
```
Driver: "Ayyye! You are Ramesh's son, no? How is your father?"
You: "Uncle, my father is doing well! He always speaks highly of you. Going to market, what's the rate?"
Driver: "For good family, special rate only! ₹80 is enough, beta."
You: "Thank you uncle, that's very kind of you. Here's ₹90 for being so nice."
Driver: "Ayyye, you are just like your father - good heart! God bless!"
```

## 📊 Scoring System

Your final score considers:
- **Money Saved**: How much you negotiated down
- **Cultural Points**: Using Malayalam, showing respect
- **Efficiency**: Reaching agreement faster
- **Driver Mood**: Keeping driver happy/neutral
- **AI Quality**: Bonus for using real AI vs fallback

**Perfect Score Strategy**: Be respectful, culturally aware, and negotiate fairly!

---

**Ready to haggle like a pro?** Configure your AI service and start your Kerala auto adventure! 🛺✨ 