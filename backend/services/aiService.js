// ─── AI Service ──────────────────────────────────────────────────
// Gemini API integration with intelligent rule-based fallback
// Works with or without API key — graceful degradation

require('dotenv').config();
const { applyRules, CROP_RISK_DATABASE } = require('./ruleEngine');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Generate AI response using Gemini API
 * Falls back to rule-based system if API unavailable
 * 
 * @param {string} systemPrompt - System instruction
 * @param {string} userMessage - Full context-injected message
 * @param {string} rawQuery - Original user message (for fallback)
 * @param {object|null} landData - User's land profile
 * @returns {Promise<string>} AI response text
 */
async function generateResponse(systemPrompt, userMessage, rawQuery, landData) {
  // Try Gemini API first
  if (GEMINI_API_KEY) {
    try {
      const response = await callGeminiAPI(systemPrompt, userMessage);
      if (response) return response;
    } catch (err) {
      console.error('Gemini API error, falling back to rule-based:', err.message);
    }
  } else {
    console.log('No GEMINI_API_KEY set — using rule-based fallback');
  }

  // Fallback to intelligent rule-based response
  return generateRuleBasedResponse(rawQuery, landData);
}

/**
 * Call Gemini REST API with retry logic
 * @param {string} systemPrompt
 * @param {string} userMessage
 * @param {number} retries
 * @returns {Promise<string|null>}
 */
async function callGeminiAPI(systemPrompt, userMessage, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const body = {
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
          topP: 0.9,
          topK: 40
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      };

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Gemini API ${response.status}: ${errData.slice(0, 200)}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) return text.trim();
      throw new Error('Empty response from Gemini');
    } catch (err) {
      console.error(`Gemini attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * attempt)); // Exponential backoff
      }
    }
  }
  return null; // All retries failed
}

/**
 * Generate intelligent response using rule engine (no AI API needed)
 * This provides a fully functional fallback system
 * 
 * @param {string} message - User's raw message
 * @param {object|null} landData - User's land profile
 * @returns {string} Formatted response
 */
function generateRuleBasedResponse(message, landData) {
  const msg = message.toLowerCase();
  const rules = applyRules(message, landData);

  // ─── Personalized greeting context ───
  const landIntro = landData 
    ? `Based on your **${landData.area}-acre ${landData.soilType} soil** land in **${landData.taluka}, ${landData.district}** with **${landData.irrigationType}** irrigation` 
    : 'Based on general knowledge for the Pune–Nashik region';

  // ─── Specific crop risk query ───
  if (rules.riskInfo) {
    const cropName = Object.keys(CROP_RISK_DATABASE).find(c => msg.includes(c.toLowerCase()));
    const risk = CROP_RISK_DATABASE[cropName];
    if (risk) {
      let response = `📊 **${cropName} Risk Assessment:**\n\n`;
      response += `${landIntro}:\n\n`;
      response += `⚠️ **Risk Level: ${risk.risk}**\n`;
      response += `💧 Water Requirement: ${risk.waterNeed}\n\n`;
      response += `**Concerns:** ${risk.concern}\n`;
      response += `**Upside:** ${risk.upside}\n`;
      
      if (landData) {
        // Check compatibility
        if (landData.irrigationType === 'Rain-fed' && risk.waterNeed.includes('High')) {
          response += `\n🚫 **Not recommended** for your rain-fed land — too water-intensive.`;
        } else if (landData.irrigationType === 'Drip' && !risk.waterNeed.includes('High')) {
          response += `\n✅ **Good fit** for your drip irrigation setup.`;
        }
      }
      
      response += `\n\n💡 Use **Analyze My Land** for a full comparison with alternative crops.`;
      return response;
    }
  }

  // ─── "What should I grow?" queries ───
  if (msg.includes('what') && (msg.includes('grow') || msg.includes('crop') || msg.includes('plant') || msg.includes('sow'))) {
    if (landData && rules.suggestedCrops.length > 0) {
      const topCrops = rules.suggestedCrops.slice(0, 3);
      let response = `🌱 **Personalized Crop Recommendations:**\n\n`;
      response += `${landIntro}:\n\n`;
      
      topCrops.forEach((crop, i) => {
        const risk = CROP_RISK_DATABASE[crop];
        const emoji = ['1️⃣', '2️⃣', '3️⃣'][i];
        response += `${emoji} **${crop}** — Risk: ${risk ? risk.risk : 'Low'}\n`;
        if (risk) response += `   ${risk.upside}\n\n`;
      });
      
      response += `💡 Run **Analyze My Land** for detailed yield & revenue estimates.`;
      return response;
    } else {
      return `🌱 **Finding Your Best Crop:**\n\nI need your land details to give personalized advice! The ideal crop depends on:\n\n1. 🟤 **Soil type** — Black, Red, Sandy, or Loamy\n2. 💧 **Irrigation** — Drip, Canal, Borewell, or Rain-fed\n3. 📅 **Season** — Kharif, Rabi, or Summer\n4. 📍 **Location** — Pune vs Nashik conditions differ\n\n👉 **Use the "Analyze My Land" tool** or tell me your soil type and I'll give quick suggestions!`;
    }
  }

  // ─── Soil queries ───
  if (msg.includes('black soil') || msg.includes('red soil') || msg.includes('sandy soil') || msg.includes('loamy soil') || (msg.includes('soil') && msg.includes('best'))) {
    const soilTypes = ['Black', 'Red', 'Sandy', 'Loamy'];
    const matchedSoil = soilTypes.find(s => msg.includes(s.toLowerCase())) || (landData ? landData.soilType : null);
    
    if (matchedSoil) {
      const { recommended, insight } = require('./ruleEngine').applyRules(message, { soilType: matchedSoil, irrigationType: landData?.irrigationType || 'Canal', season: landData?.season || 'Kharif', district: landData?.district || 'Pune' });
      return `🟤 **${matchedSoil} Soil Recommendations:**\n\n${insight || 'Great soil choice!'}\n\n**Top Crops:** ${rules.suggestedCrops.slice(0, 5).join(', ')}\n\n💡 Tell me your irrigation type for more specific advice, or use **Analyze My Land** for full recommendations.`;
    }
  }

  // ─── Season queries ───
  if (msg.includes('kharif')) {
    return `🌧️ **Kharif Season Crops (June–October):**\n\n${landIntro}:\n\n1. 🫘 **Soybean** — Low risk, rain-fed friendly\n2. 🌿 **Cotton** — High demand, MSP supported\n3. 🌽 **Maize** — Versatile, growing demand\n4. 🌾 **Bajra** — Minimal water, government push\n5. 🥜 **Groundnut** — Good for sandy/red soil\n\n💡 Kharif relies on monsoon — choose rain-tolerant varieties if no irrigation backup.`;
  }
  if (msg.includes('rabi')) {
    return `❄️ **Rabi Season Crops (October–March):**\n\n${landIntro}:\n\n1. 🌾 **Wheat** — Stable MSP, needs irrigation\n2. 🧅 **Onion** — High volume, Nashik specialty\n3. 🍅 **Tomato** — Good margins with drip\n4. 🌿 **Jowar** — Low input, safe returns\n5. 🍇 **Grapes** — Premium, needs expertise\n\n💡 Rabi crops need assured irrigation. Canal or borewell recommended.`;
  }
  if (msg.includes('summer')) {
    return `☀️ **Summer Season Crops (March–June):**\n\n${landIntro}:\n\n1. 🍎 **Pomegranate** — Heat-tolerant, premium\n2. 🌾 **Sugarcane** — Ratoon crop continues\n3. 🥜 **Groundnut (Summer)** — Quick turnaround\n4. 🍅 **Tomato** — Off-season premium prices\n\n⚠️ Water is critical in summer. Drip irrigation strongly recommended.`;
  }

  // ─── Specific crop queries ───
  if (msg.includes('grape') || msg.includes('grapes')) {
    return `🍇 **Grapes Insight (Nashik-Pune Region):**\n\n${landIntro}:\n\n• Nashik is India's grape capital — ideal climate.\n• **Mandatory:** Drip irrigation only.\n• Revenue: ₹3–12 lakh/acre (table grapes vs wine grapes).\n• Risk: Medium — disease management (downy mildew) is critical.\n• **Best soil:** Red or sandy loam.\n\n💡 Consider Thompson Seedless for export or Bangalore Blue for local markets.`;
  }
  if (msg.includes('pomegranate')) {
    return `🍎 **Pomegranate Insight:**\n\n${landIntro}:\n\n• **Excellent for water-scarce areas** — very drought-resistant.\n• Revenue: ₹2.5–10 lakh/acre depending on quality.\n• Nashik & Solapur are major hubs.\n• Risk: Low-Medium. Watch for bacterial blight.\n• Works well with drip or borewell irrigation.\n\n💡 Export-quality Bhagwa variety fetches premium prices.`;
  }
  if (msg.includes('onion')) {
    return `🧅 **Onion Market Analysis:**\n\n${landIntro}:\n\n• Nashik = India's onion capital (Lasalgaon APMC).\n• **High volume, volatile pricing** — ₹10–35/kg range.\n• Best in Rabi season with red/loamy soil.\n• Risk: Medium — price crashes happen, but cold storage mitigates.\n• Yield: 60–100 quintals/acre.\n\n💡 Late Kharif onion often gets the best prices (Oct-Dec).`;
  }

  // ─── Revenue / price queries ───
  if (msg.includes('price') || msg.includes('cost') || msg.includes('revenue') || msg.includes('profit') || msg.includes('how much') || msg.includes('money') || msg.includes('income')) {
    return `💰 **Revenue Estimates by Crop (per acre/year):**\n\n${landIntro}:\n\n• 🍇 Grapes: ₹3–12 lakh\n• 🍎 Pomegranate: ₹2.5–10 lakh\n• 🌾 Sugarcane: ₹1–2.5 lakh\n• 🧅 Onion: ₹60K–3.5 lakh\n• 🫘 Soybean: ₹27K–55K\n• 🌿 Cotton: ₹52K–1 lakh\n\n💡 Use **Analyze Land** for estimates specific to your land.`;
  }

  // ─── Water / irrigation queries ───
  if (msg.includes('water') || msg.includes('irrigation') || msg.includes('drip') || msg.includes('rain')) {
    return `💧 **Irrigation Guide:**\n\n${landIntro}:\n\n• **Drip:** Best for grapes, pomegranate, tomato. Saves 40-60% water.\n• **Canal:** Good for sugarcane, wheat, paddy. Steady supply.\n• **Borewell:** Versatile. Check groundwater levels.\n• **Rain-fed:** Stick to bajra, jowar, groundnut, soybean.\n\n⚠️ Avoid sugarcane, grapes if rain-fed only.\n💡 Government subsidies available for drip/sprinkler installation (PMKSY).`;
  }

  // ─── Platform / help queries ───
  if (msg.includes('how') || msg.includes('help') || msg.includes('start') || msg.includes('guide') || msg.includes('platform')) {
    return `🌟 **Land Intelligence Platform Guide:**\n\n1. 📊 **Analyze Land** — Enter land details → get AI crop recommendations with risk scores\n2. 🔍 **Discover** — Browse verified lands for leasing\n3. 📋 **Dashboard** — Track your land profiles and past analysis reports\n4. 💬 **Ask Me** — I advise on crops, soil, seasons, and farming strategy\n\n**Quick Tips:**\n• Tell me your soil type for crop suggestions\n• Ask about any crop's risk level\n• Ask about Kharif/Rabi/Summer crops`;
  }

  // ─── Lease / listing queries ───
  if (msg.includes('lease') || msg.includes('rent') || msg.includes('list land') || msg.includes('sell')) {
    return `🏡 **Land Leasing on AgriLease:**\n\n• **List Your Land** — Go to Dashboard → My Lands. You'll need your 7/12 extract and basic details.\n• **Find Land** — Browse the 'Discover' tab with filters for price, location, and area.\n• **Secure Deals** — Digital agreements with escrow payment protection.\n\n💡 Verified lands get 3x more inquiries!`;
  }

  // ─── Fallback with personalization ───
  if (landData) {
    return `🌱 I'm your **AgriLease AI Advisor** — here to help with your ${landData.area}-acre farm in ${landData.district}!\n\nI can help with:\n• 🌾 Crop recommendations for your ${landData.soilType} soil\n• 📊 Risk assessment for specific crops\n• 💧 Irrigation advice for ${landData.irrigationType} systems\n• 📅 Season-wise planting guides\n• 💰 Revenue and yield estimates\n\nAsk me anything! For example:\n• "What should I grow this ${landData.season} season?"\n• "Is sugarcane risky for my land?"\n• "Compare cotton vs soybean"`;
  }

  return `🌱 I'm your **AgriLease AI Assistant** — here to help with farming decisions!\n\nI can help with:\n• Crop recommendations for your soil type\n• Risk assessment for specific crops\n• Season-wise planting guides\n• Revenue and yield estimates\n• Platform navigation\n\n👉 **Tip:** Use **Analyze My Land** or share your land details (soil, irrigation, location) for personalized advice!`;
}

module.exports = {
  generateResponse
};
