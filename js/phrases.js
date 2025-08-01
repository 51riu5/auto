// Auto-Rickshaw Negotiation Simulator - Phrases and Cultural Context

const DRIVER_PHRASES = {
    // Greetings and initial contact
    greetings: {
        airport: [
            "Where to, sir? Airport rate is different, you know.",
            "Come, come! I give you good price. Only ₹{price}!",
            "Foreign? No problem, I speak English. Special price for you!",
            "Taxi queue very long, sir. I take you faster!"
        ],
        railway: [
            "Station to where, brother? Meter not working today.",
            "Heavy luggage? Extra charge, but I help you!",
            "Which platform you came from? Okay, I know best route.",
            "Train late? No problem, I wait. But waiting charge applies."
        ],
        market: [
            "Market shopping finished? Bags are heavy, take auto!",
            "Ayyyo, so many bags! Where to carry all this?",
            "Local resident? I give you local rate only.",
            "Market crowd too much today. Auto is best option."
        ],
        residential: [
            "Evening time, traffic will be less. Good time to travel.",
            "You staying in this area? I know all shortcuts here.",
            "Regular customer? I remember your face!",
            "Local area, so meter rate only. Fair deal."
        ],
        uncle: [
            "Ayyye! You are Ramesh's son, no? I know your father!",
            "How is your amma keeping? Long time no see family.",
            "Beta, where you want to go? Uncle will take care.",
            "Your grandfather and I used to work together. Good family!"
        ]
    },

    // Price negotiations
    negotiation: {
        high_price: [
            "Sir, this is minimum rate. Petrol price is very high now.",
            "Ayyyo, less than this not possible. I have family to feed.",
            "You want good service or cheap service? Quality costs money.",
            "Other drivers will charge double. I'm giving discount already."
        ],
        moderate_price: [
            "Okay, okay. For you special price. But don't tell others!",
            "Because you are good person, I reduce little bit.",
            "This area, usually I charge more. But you seem nice.",
            "Final price this much only. Take it or leave it."
        ],
        low_price: [
            "Ayyyo brother, that price is loss for me!",
            "Even bus ticket costs that much these days!",
            "You are killing me with this price. Have some mercy!",
            "I have to put petrol, pay EMI... How to manage with this?"
        ]
    },

    // Responses to player strategies
    responses: {
        meter_request: [
            "Meter? Ayyyo, broken since morning. RTO office closed for repair.",
            "Sir, meter shows wrong reading in traffic. Fixed rate is better.",
            "Meter runs fast in this heat. I save you money with fixed price.",
            "Government increased meter rates yesterday. My price is cheaper."
        ],
        local_knowledge: [
            "You know local rates? Good, good. Then you understand fair price.",
            "Local person will not cheat local person. This is reasonable rate.",
            "If you know area, then you know petrol pump prices also increased.",
            "Ayyye, you speak Malayalam? Then you know ₹{price} is correct price."
        ],
        walking_away: [
            "Okay, okay! Come back! We can discuss...",
            "Sir, sir! Wait! Let's talk properly.",
            "Ayyyo, don't go in this sun! Come, I give better price.",
            "Other drivers will charge more. I'm your best option here!"
        ],
        family_connection: [
            "Oh! You know my cousin Suresh? Small world!",
            "If you are family friend, then definitely special price for you.",
            "Your uncle helped my brother get job? Then we are family!",
            "Ayyye, you should have told earlier! Family discount applies."
        ]
    },

    // Mood-based responses
    moods: {
        happy: {
            emoji: "😊",
            phrases: [
                "Today is good day! Business is good, mood is good!",
                "You are very nice customer. Pleasant to talk with.",
                "Okay, deal! You made my day with this fair negotiation.",
                "Good bargaining! I respect people who negotiate properly."
            ]
        },
        neutral: {
            emoji: "😐",
            phrases: [
                "Business is business. Nothing personal.",
                "This is standard rate. Take it or find another auto.",
                "I quote fair price. You decide what you want to do.",
                "Too much talking. Just tell me - you want ride or not?"
            ]
        },
        annoyed: {
            emoji: "😤",
            phrases: [
                "Why you wasting my time? Other customers are waiting!",
                "You think I'm running charity service here?",
                "Very cheap people these days. No respect for drivers.",
                "Go take bus if you want cheap ride. This is auto service!"
            ]
        },
        angry: {
            emoji: "😠",
            phrases: [
                "Enough! Find another auto. I don't need your business!",
                "You are insulting me with this price. Go walk!",
                "Twenty years I'm driving auto. Never seen such cheap person!",
                "I'm not running NGO here. Pay proper price or get out!"
            ]
        }
    },

    // Special situations
    special: {
        rain: [
            "Rain started! Now surge pricing applies. ₹{price} extra.",
            "In rain, everyone wants auto. High demand, high price.",
            "Your clothes will get wet in rain. Auto is safe option."
        ],
        traffic: [
            "Traffic jam means more petrol consumption. Price increases.",
            "In traffic, time is money. Both yours and mine.",
            "Signal timing is bad today. Will take longer route."
        ],
        festival: [
            "Festival season! Everyone going out. Demand is high.",
            "Onam bonus time! Little extra charge for celebration.",
            "Festival traffic means longer journey. Price accordingly."
        ]
    }
};

// Player response options with cultural context
const PLAYER_RESPONSES = {
    polite: {
        malayalam: [
            "Setta, konjam kurayikamo? (Brother, can you reduce a little?)",
            "Fair price parayamo? (Can you tell fair price?)",
            "Meter rate kittumo? (Can we get meter rate?)",
            "Regular customer anu, discount undo? (I'm regular customer, any discount?)"
        ],
        english: [
            "Uncle, can you give me a good rate?",
            "That seems a bit high. Can you reduce?",
            "What's the meter rate for this distance?",
            "I'm a local resident. Can you give local rate?"
        ]
    },
    
    assertive: [
        "I know the actual fare. Don't try to overcharge me.",
        "Show me the rate chart if you're charging extra.",
        "I'll pay meter rate plus 10%. That's fair.",
        "There are other autos here. Give me reasonable price."
    ],
    
    friendly: [
        "Come on, uncle. We're both from Kerala. Help me out!",
        "I take auto daily from here. You can give regular customer rate.",
        "My Malayalam isn't great, but I know you're a good person.",
        "Make it reasonable and I'll recommend you to my friends."
    ],
    
    cultural: [
        "My grandfather always said Malayalis help each other.",
        "Kerala hospitality is famous. Show me that spirit!",
        "God's own country people are generous, right?",
        "In Kerala, we treat guests well. I'm your guest today."
    ],
    
    practical: [
        "Bus costs only ₹{bus_fare}. Make it reasonable.",
        "I can walk if needed. Your call on the price.",
        "Uber/Ola is showing ₹{app_fare}. Can you match?",
        "Let's both be practical. What works for both of us?"
    ]
};

// Cultural tips and context for players
const CULTURAL_TIPS = {
    dos: [
        "Address drivers as 'Uncle', 'Chettan' (brother), or 'Setta' (casual brother)",
        "Mention local connections or family if you have them",
        "Be respectful but firm in negotiations",
        "Learn a few Malayalam phrases - drivers appreciate the effort",
        "Compliment Kerala's beauty or hospitality to build rapport",
        "Carry exact change to avoid 'no change' situations"
    ],
    
    donts: [
        "Don't be rude or dismissive - respect goes both ways",
        "Don't immediately assume you're being cheated",
        "Don't argue if you genuinely don't know local rates",
        "Don't use Malayalam incorrectly - it might backfire",
        "Don't compare Kerala unfavorably to other states",
        "Don't flash expensive items while negotiating low prices"
    ],
    
    insider_knowledge: [
        "Airport and railway station rates are genuinely higher due to official fees",
        "Many drivers are from other states - not all speak Malayalam",
        "Evening rates are typically 10-15% higher",
        "Meters are often not calibrated correctly or genuinely broken",
        "Sharing autos is common and can reduce your cost",
        "Tipping ₹5-10 for good service builds goodwill for future rides"
    ]
};

// Malayalam vocabulary for players
const MALAYALAM_BASICS = {
    greetings: {
        "Namaskaram": "Hello/Goodbye (formal)",
        "Vanakkam": "Hello (casual)",
        "Sukham aano?": "How are you?",
        "Entha vishesham?": "What's the news?"
    },
    
    negotiation: {
        "Velayku kittumo?": "Can you give me a good price?",
        "Adhikam aanu": "It's too much",
        "Kurayikamo?": "Can you reduce?",
        "Meter rate": "Meter rate (English word commonly used)",
        "Nyayamaya vila": "Fair price"
    },
    
    locations: {
        "Evide?": "Where?",
        "Airport": "Airport",
        "Railway station": "Railway station", 
        "Market": "Market",
        "Angane pokam": "Let's go like that",
        "Veedu": "Home/house"
    },
    
    courtesy: {
        "Nanni": "Thank you",
        "Kshama": "Sorry/Excuse me",
        "Parayam": "Tell me",
        "Shari": "Okay/Alright",
        "Poli": "Great/Awesome"
    }
};

// Make objects globally available for browser
window.DRIVER_PHRASES = DRIVER_PHRASES;
window.PLAYER_RESPONSES = PLAYER_RESPONSES;
window.CULTURAL_TIPS = CULTURAL_TIPS;
window.MALAYALAM_BASICS = MALAYALAM_BASICS;

// Debug logging to verify loading
console.log('✅ Driver phrases loaded successfully');
console.log('🗣️ Available phrase categories:', Object.keys(DRIVER_PHRASES)); 