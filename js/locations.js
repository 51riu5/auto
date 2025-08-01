// Auto-Rickshaw Negotiation Simulator - Locations Configuration

const LOCATIONS = {
    airport: {
        name: "Kochi Airport",
        difficulty: "nightmare",
        difficultyLabel: "🔥 Nightmare Mode",
        description: "Tourist trap central. Drivers here know you're desperate and have deep pockets.",
        baseFare: 250,
        fairPrice: 180,
        initialMultiplier: 3.0, // They start at 3x fair price
        stubbornness: 0.9, // Very stubborn
        greediness: 0.95, // Extremely greedy
        timeOfDay: "day",
        environment: {
            preset: "forest",
            groundColor: "#8B7355",
            grid: "cross",
            fog: 0.1
        },
        driverPersonality: {
            patience: 3, // Low patience
            humor: 0.2, // Not much humor
            localKnowledge: 0.3, // Don't care about local connections
            touristFriendly: 0.1 // Hostile to tourists
        },
        commonScenarios: [
            "meter_broken",
            "traffic_excuse",
            "airport_premium",
            "late_night_charge"
        ]
    },
    
    railway: {
        name: "Ernakulam Railway Station",
        difficulty: "hard",
        difficultyLabel: "🚂 Hard Mode",
        description: "Busy station with experienced drivers who know all the tricks.",
        baseFare: 150,
        fairPrice: 120,
        initialMultiplier: 2.2,
        stubbornness: 0.7,
        greediness: 0.8,
        timeOfDay: "day",
        environment: {
            preset: "checkerboard",
            groundColor: "#666",
            grid: "cross",
            fog: 0.05
        },
        driverPersonality: {
            patience: 5,
            humor: 0.4,
            localKnowledge: 0.5,
            touristFriendly: 0.3
        },
        commonScenarios: [
            "meter_broken",
            "sharing_ride",
            "station_tax",
            "luggage_charge"
        ]
    },
    
    market: {
        name: "Broadway Market",
        difficulty: "medium",
        difficultyLabel: "🏪 Medium Mode",
        description: "Local market area where some negotiation is expected.",
        baseFare: 100,
        fairPrice: 80,
        initialMultiplier: 1.8,
        stubbornness: 0.5,
        greediness: 0.6,
        timeOfDay: "day",
        environment: {
            preset: "default",
            groundColor: "#7BC8A4",
            grid: "cross",
            fog: 0.02
        },
        driverPersonality: {
            patience: 7,
            humor: 0.6,
            localKnowledge: 0.7,
            touristFriendly: 0.5
        },
        commonScenarios: [
            "short_distance",
            "market_crowd",
            "regular_customer",
            "small_change"
        ]
    },
    
    residential: {
        name: "Residential Area",
        difficulty: "easy",
        difficultyLabel: "🏘️ Easy Mode",
        description: "Local neighborhood where drivers are more reasonable.",
        baseFare: 80,
        fairPrice: 70,
        initialMultiplier: 1.4,
        stubbornness: 0.3,
        greediness: 0.4,
        timeOfDay: "evening",
        environment: {
            preset: "dawn",
            groundColor: "#A7C48C",
            grid: "cross",
            fog: 0.01
        },
        driverPersonality: {
            patience: 8,
            humor: 0.7,
            localKnowledge: 0.8,
            touristFriendly: 0.7
        },
        commonScenarios: [
            "neighborhood_discount",
            "return_trip",
            "local_chat",
            "family_reference"
        ]
    },
    
    uncle: {
        name: "Local Uncle's Auto",
        difficulty: "tutorial",
        difficultyLabel: "👨‍🦳 Tutorial Mode",
        description: "Uncle Ravi knows your family. He's still going to negotiate though!",
        baseFare: 60,
        fairPrice: 50,
        initialMultiplier: 1.2,
        stubbornness: 0.1,
        greediness: 0.2,
        timeOfDay: "evening",
        environment: {
            preset: "starry",
            groundColor: "#9A8C98",
            grid: "cross",
            fog: 0.005
        },
        driverPersonality: {
            patience: 10,
            humor: 0.9,
            localKnowledge: 1.0,
            touristFriendly: 0.9
        },
        commonScenarios: [
            "family_connection",
            "teaching_moment",
            "local_gossip",
            "blessing_discount"
        ],
        specialFeatures: {
            knowsFamily: true,
            givesAdvice: true,
            malayalamMode: true
        }
    }
};

// Scenario definitions for different situations
const SCENARIOS = {
    meter_broken: {
        name: "Meter Broken",
        description: "The meter is conveniently not working",
        priceImpact: 1.3,
        responses: {
            challenge: "Point out that working meters are legally required",
            accept: "Agree to negotiate without meter",
            walk_away: "Threaten to find another auto"
        }
    },
    
    traffic_excuse: {
        name: "Traffic Heavy",
        description: "Driver claims there's heavy traffic on your route",
        priceImpact: 1.2,
        responses: {
            challenge: "Suggest an alternate route you know",
            accept: "Accept the traffic surcharge",
            walk_away: "Say you'll take the bus instead"
        }
    },
    
    airport_premium: {
        name: "Airport Premium",
        description: "Special airport charges apply",
        priceImpact: 1.5,
        responses: {
            challenge: "Ask to see the official rate chart",
            accept: "Pay the premium without argument",
            walk_away: "Head to the prepaid taxi counter"
        }
    },
    
    family_connection: {
        name: "Family Friend",
        description: "Uncle mentions knowing your relatives",
        priceImpact: 0.8,
        responses: {
            leverage: "Mention specific family members",
            polite: "Be respectful and grateful",
            business: "Keep it strictly business"
        }
    },
    
    local_gossip: {
        name: "Local News",
        description: "Uncle wants to share local news and gossip",
        priceImpact: 0.9,
        responses: {
            engage: "Listen and participate in conversation",
            polite: "Politely listen while checking phone",
            hurry: "Mention you're in a hurry"
        }
    }
};

// Time of day affects pricing and driver behavior
const TIME_MODIFIERS = {
    morning: { priceMultiplier: 1.0, patience: 1.0 },
    day: { priceMultiplier: 1.0, patience: 0.9 },
    evening: { priceMultiplier: 1.1, patience: 1.1 },
    night: { priceMultiplier: 1.3, patience: 0.7 }
};

// Weather conditions (future feature)
const WEATHER_CONDITIONS = {
    sunny: { priceMultiplier: 1.0, mood: 1.0 },
    rainy: { priceMultiplier: 1.2, mood: 0.8 },
    cloudy: { priceMultiplier: 1.0, mood: 0.9 }
};

// Make objects globally available for browser
window.LOCATIONS = LOCATIONS;
window.SCENARIOS = SCENARIOS;
window.TIME_MODIFIERS = TIME_MODIFIERS;
window.WEATHER_CONDITIONS = WEATHER_CONDITIONS;

// Debug logging to verify loading
console.log('✅ Locations loaded successfully:', Object.keys(LOCATIONS).length, 'locations available');
console.log('📍 Available locations:', Object.keys(LOCATIONS));

// Test a sample location to ensure data integrity
const sampleLocation = LOCATIONS.uncle;
if (sampleLocation) {
    console.log('🧪 Sample location test (Uncle Ravi):', {
        name: sampleLocation.name,
        fairPrice: sampleLocation.fairPrice,
        initialMultiplier: sampleLocation.initialMultiplier,
        calculatedInitialPrice: Math.round(sampleLocation.fairPrice * sampleLocation.initialMultiplier)
    });
} else {
    console.error('❌ Sample location test failed - uncle location not found');
} 