// ─── Rule-Based Intelligence Engine ──────────────────────────────
// Applied BEFORE the AI response to provide grounded, factual insights
// These rules ensure accuracy even when AI hallucinates

const SOIL_CROP_RULES = {
  'Black': {
    recommended: ['Cotton', 'Soybean', 'Sugarcane', 'Jowar', 'Maize', 'Wheat'],
    avoid: ['Grapes'],
    insight: 'Black (Regur) soil has excellent moisture retention — ideal for cotton and soybean.'
  },
  'Red': {
    recommended: ['Pomegranate', 'Groundnut', 'Onion', 'Grapes', 'Bajra'],
    avoid: ['Sugarcane', 'Wheat'],
    insight: 'Red (Laterite) soil is well-drained — perfect for horticulture and root crops.'
  },
  'Sandy': {
    recommended: ['Bajra', 'Groundnut', 'Pomegranate', 'Grapes'],
    avoid: ['Sugarcane', 'Cotton', 'Wheat'],
    insight: 'Sandy soil drains quickly — choose drought-resistant crops or use drip irrigation.'
  },
  'Loamy': {
    recommended: ['Tomato', 'Onion', 'Maize', 'Wheat', 'Soybean', 'Cotton', 'Grapes'],
    avoid: [],
    insight: 'Loamy soil is versatile — most crops grow well. Focus on high-value options.'
  }
};

const IRRIGATION_CROP_RULES = {
  'Drip': {
    recommended: ['Grapes', 'Pomegranate', 'Tomato', 'Onion'],
    avoid: [],
    insight: 'Drip irrigation allows premium horticulture crops with 40-60% water savings.'
  },
  'Canal': {
    recommended: ['Sugarcane', 'Wheat', 'Maize', 'Onion'],
    avoid: [],
    insight: 'Canal irrigation provides steady water supply for water-intensive crops.'
  },
  'Borewell': {
    recommended: ['Pomegranate', 'Onion', 'Tomato', 'Maize', 'Wheat'],
    avoid: ['Sugarcane'],
    insight: 'Borewell provides moderate water. Monitor groundwater levels carefully.'
  },
  'Rain-fed': {
    recommended: ['Bajra', 'Jowar', 'Soybean', 'Groundnut'],
    avoid: ['Sugarcane', 'Grapes', 'Wheat'],
    insight: '⚠️ Rain-fed farming limits options. Stick to drought-resistant, low-water crops.'
  }
};

const SEASON_CROP_RULES = {
  'Kharif': {
    recommended: ['Soybean', 'Cotton', 'Maize', 'Bajra', 'Groundnut', 'Jowar', 'Onion', 'Sugarcane'],
    insight: 'Kharif (June–Oct) relies on monsoon rains. Choose rain-tolerant varieties.'
  },
  'Rabi': {
    recommended: ['Wheat', 'Onion', 'Tomato', 'Jowar', 'Grapes'],
    insight: 'Rabi (Oct–Mar) needs assured irrigation. Cool climate favors wheat and onion.'
  },
  'Summer': {
    recommended: ['Pomegranate', 'Sugarcane', 'Groundnut', 'Tomato'],
    insight: 'Summer (Mar–Jun) requires drip/canal irrigation. Water is the limiting factor.'
  }
};

const DISTRICT_SPECIALTIES = {
  'Nashik': {
    crops: ['Grapes', 'Onion', 'Pomegranate', 'Tomato'],
    insight: 'Nashik is India\'s grape and onion capital with established export markets and cold storage.'
  },
  'Pune': {
    crops: ['Sugarcane', 'Soybean', 'Cotton', 'Maize', 'Wheat'],
    insight: 'Pune belt has strong cooperative sugar factories and progressive farming infrastructure.'
  }
};

const CROP_RISK_DATABASE = {
  'Sugarcane': { risk: 'Medium-High', waterNeed: 'Very High (~2000mm)', concern: 'Payment delays from sugar factories, high water consumption.', upside: 'Guaranteed FRP price, stable demand.' },
  'Grapes': { risk: 'Medium', waterNeed: 'Medium (drip only)', concern: 'Disease management (downy mildew), requires expertise.', upside: 'High export value, ₹3-12L/acre revenue.' },
  'Pomegranate': { risk: 'Low-Medium', waterNeed: 'Low', concern: 'Bacterial blight risk, long gestation period.', upside: 'Drought-resistant, premium export prices (Bhagwa variety).' },
  'Onion': { risk: 'Medium', waterNeed: 'Medium', concern: 'Price volatility (₹10-35/kg range), storage losses.', upside: 'High volume, Nashik APMC proximity.' },
  'Cotton': { risk: 'Low-Medium', waterNeed: 'Medium', concern: 'Bollworm pest pressure, quality dependent on rain timing.', upside: 'Strong MSP support, reliable demand.' },
  'Soybean': { risk: 'Low', waterNeed: 'Low', concern: 'Price dependent on global market, limited to Kharif.', upside: 'Minimal investment, rain-fed friendly, soil health improver.' },
  'Maize': { risk: 'Low', waterNeed: 'Medium', concern: 'Lower per-acre revenue compared to horticulture.', upside: 'Versatile demand (poultry feed, starch), reliable yields.' },
  'Tomato': { risk: 'Medium-High', waterNeed: 'Medium', concern: 'Extreme price volatility, perishable, needs cold chain.', upside: 'Very high yields (80-120q/acre), off-season premiums.' },
  'Bajra': { risk: 'Very Low', waterNeed: 'Very Low', concern: 'Low per-acre revenue.', upside: 'Guaranteed MSP, minimal investment, government millet push.' },
  'Jowar': { risk: 'Very Low', waterNeed: 'Very Low', concern: 'Low per-acre revenue, limited market beyond local.', upside: 'Dual-purpose (grain + fodder), traditional demand.' },
  'Groundnut': { risk: 'Low', waterNeed: 'Low', concern: 'Susceptible to aflatoxin in wet conditions.', upside: 'Steady oil demand, improves soil nitrogen.' },
  'Wheat': { risk: 'Low', waterNeed: 'Medium', concern: 'Needs assured irrigation, not ideal for western Maharashtra.', upside: 'Stable MSP procurement, low risk.' }
};

/**
 * Apply rule-based intelligence to a user query given their land data
 * @param {string} message - User's chat message
 * @param {object|null} landData - User's land profile (or null)
 * @returns {object} { insights: string, suggestedCrops: string[], riskInfo: string|null }
 */
function applyRules(message, landData) {
  const msg = message.toLowerCase();
  const insights = [];
  let suggestedCrops = [];
  let riskInfo = null;

  // ─── If land data is available, apply land-specific rules ───
  if (landData) {
    const soil = landData.soilType;
    const irrigation = landData.irrigationType;
    const season = landData.season;
    const district = landData.district;

    // Soil rules
    if (soil && SOIL_CROP_RULES[soil]) {
      const rule = SOIL_CROP_RULES[soil];
      insights.push(rule.insight);
      suggestedCrops.push(...rule.recommended);
    }

    // Irrigation rules
    if (irrigation && IRRIGATION_CROP_RULES[irrigation]) {
      const rule = IRRIGATION_CROP_RULES[irrigation];
      insights.push(rule.insight);
      // Intersect with soil suggestions
      if (suggestedCrops.length > 0) {
        const irrigationSet = new Set(rule.recommended);
        suggestedCrops = suggestedCrops.filter(c => irrigationSet.has(c));
        if (suggestedCrops.length === 0) suggestedCrops = rule.recommended;
      } else {
        suggestedCrops = rule.recommended;
      }
      // Add avoid warnings
      if (rule.avoid.length > 0) {
        insights.push(`⚠️ Avoid with ${irrigation} irrigation: ${rule.avoid.join(', ')}`);
      }
    }

    // Season rules
    if (season && SEASON_CROP_RULES[season]) {
      const rule = SEASON_CROP_RULES[season];
      insights.push(rule.insight);
      const seasonSet = new Set(rule.recommended);
      suggestedCrops = suggestedCrops.filter(c => seasonSet.has(c));
      if (suggestedCrops.length === 0) suggestedCrops = rule.recommended.slice(0, 4);
    }

    // District specialties
    if (district && DISTRICT_SPECIALTIES[district]) {
      const spec = DISTRICT_SPECIALTIES[district];
      insights.push(spec.insight);
    }
  }

  // ─── Query-specific risk analysis ───
  for (const [cropName, riskData] of Object.entries(CROP_RISK_DATABASE)) {
    if (msg.includes(cropName.toLowerCase())) {
      riskInfo = `${cropName} — Risk: ${riskData.risk}, Water: ${riskData.waterNeed}. Concern: ${riskData.concern} Upside: ${riskData.upside}`;
      
      // Check compatibility with user's land
      if (landData) {
        const irrigRule = IRRIGATION_CROP_RULES[landData.irrigationType];
        if (irrigRule && irrigRule.avoid.includes(cropName)) {
          riskInfo += ` ⚠️ WARNING: ${cropName} is NOT recommended for ${landData.irrigationType} irrigation.`;
        }
        const soilRule = SOIL_CROP_RULES[landData.soilType];
        if (soilRule && soilRule.avoid.includes(cropName)) {
          riskInfo += ` ⚠️ WARNING: ${cropName} is NOT ideal for ${landData.soilType} soil.`;
        }
      }
      break;
    }
  }

  // ─── Deduplicate crops ───
  suggestedCrops = [...new Set(suggestedCrops)].slice(0, 5);

  return {
    insights: insights.join('\n'),
    suggestedCrops,
    riskInfo
  };
}

/**
 * Get risk assessment for a specific crop
 */
function getCropRisk(cropName) {
  const key = Object.keys(CROP_RISK_DATABASE).find(k => k.toLowerCase() === cropName.toLowerCase());
  return key ? CROP_RISK_DATABASE[key] : null;
}

module.exports = {
  applyRules,
  getCropRisk,
  CROP_RISK_DATABASE
};
