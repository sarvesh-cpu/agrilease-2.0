const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ reply: "Please provide a message." });
  }

  const lowercaseMsg = message.toLowerCase();
  let reply = "I'm your AgriLease AI Assistant. I can help you find the best crop for your land, assess risks, or guide you through the platform. How can I help?";

  // ─── Image Analysis (Vision Mock) ──────────────────────────────
  if (req.body.image) {
    reply = `I've analyzed the image of your land. Based on the visual texture and color, this appears to be **Red Laterite Soil** mixed with loamy characteristics, typical in parts of Maharashtra like Ratnagiri or Western Ghats margins.\n\n🌱 **Suggested Crops:** Groundnuts, Cashews, Sugarcane, or Millets.\n💧 **Water Retention:** Moderate to low. Drip irrigation is recommended.\n📊 **Next Step:** Use the **Analyze Land** tool for a detailed, data-driven crop recommendation tailored to your exact location and season.\n\nWould you like me to help you start an analysis?`;
  }
  // ─── Crop-Specific Intelligence ────────────────────────────────
  else if (lowercaseMsg.includes('sugarcane') && (lowercaseMsg.includes('risk') || lowercaseMsg.includes('risky'))) {
    reply = `🌾 **Sugarcane Risk Assessment:**\n\n⚠️ **Risk Level: Medium-High** this season\n\n**Factors:**\n• Water requirement is very high (~2000mm). Check your irrigation capacity.\n• Cooperative sugar factory prices are fixed but payment delays are common.\n• Best with **drip irrigation** in Pune belt — reduces water use by 40%.\n• Avoid if your land is **rain-fed** — too water-intensive.\n\n💡 **Recommendation:** If you have canal/drip irrigation and 5+ acres, sugarcane can yield ₹1.5–2.5 lakh/acre. Otherwise, consider soybean or cotton.`;
  }
  else if (lowercaseMsg.includes('grape') || lowercaseMsg.includes('grapes')) {
    reply = `🍇 **Grapes Insight (Nashik-Pune Region):**\n\n• Nashik is India's grape capital — ideal climate.\n• **Mandatory:** Drip irrigation only.\n• Revenue: ₹3–12 lakh/acre (table grapes vs wine grapes).\n• Risk: Medium — disease management (downy mildew) is critical.\n• **Best soil:** Red or sandy loam.\n\n💡 Consider Thompson Seedless for export markets or Bangalore Blue for local.`;
  }
  else if (lowercaseMsg.includes('pomegranate')) {
    reply = `🍎 **Pomegranate Insight:**\n\n• **Excellent for water-scarce areas** — very drought-resistant.\n• Revenue: ₹2.5–10 lakh/acre depending on quality.\n• Nashik & Solapur are major hubs.\n• Risk: Low-Medium. Watch for bacterial blight.\n• Works well with drip or borewell irrigation.\n\n💡 Export-quality Bhagwa variety fetches premium prices.`;
  }
  else if (lowercaseMsg.includes('onion')) {
    reply = `🧅 **Onion Market Analysis:**\n\n• Nashik = India's onion capital (Lasalgaon APMC).\n• **High volume, volatile pricing** — ₹10–35/kg range.\n• Best in Rabi season with red/loamy soil.\n• Risk: Medium — price crashes can happen, but cold storage mitigates.\n• Yield: 60–100 quintals/acre.\n\n💡 Late Kharif onion often gets the best prices (Oct-Dec).`;
  }
  // ─── Soil-Based Recommendations ────────────────────────────────
  else if (lowercaseMsg.includes('black soil') || (lowercaseMsg.includes('black') && lowercaseMsg.includes('soil'))) {
    reply = `🟤 **Black Soil (Regur) Recommendations:**\n\nBlack cotton soil is excellent for moisture retention!\n\n**Top Crops:**\n1. 🌿 **Cotton** — Natural fit, strong MSP support\n2. 🫘 **Soybean** — Low investment, good returns in Kharif\n3. 🌾 **Sugarcane** — If irrigation is available\n4. 🌾 **Jowar** — Safe, low-risk Rabi option\n\n💡 Use the **Analyze Land** tool for personalized recommendations based on your irrigation and season.`;
  }
  else if (lowercaseMsg.includes('red soil')) {
    reply = `🔴 **Red Soil Recommendations:**\n\nRed soil is well-drained — perfect for root crops and fruits!\n\n**Top Crops:**\n1. 🍎 **Pomegranate** — Drought-resistant, high value\n2. 🥜 **Groundnut** — Low water need, Kharif season\n3. 🧅 **Onion** — Nashik specialty\n4. 🍇 **Grapes** — If drip irrigation is available\n\n💡 Red soil + drip irrigation is a powerful combination for horticulture.`;
  }
  // ─── Best Crop Queries ─────────────────────────────────────────
  else if (lowercaseMsg.includes('best crop') || lowercaseMsg.includes('what to grow') || lowercaseMsg.includes('which crop')) {
    reply = `🌱 **Finding Your Best Crop:**\n\nThe ideal crop depends on 4 key factors:\n1. 🟤 **Soil type** — Black, Red, Sandy, or Loamy\n2. 💧 **Irrigation** — Drip, Canal, Borewell, or Rain-fed\n3. 📅 **Season** — Kharif, Rabi, or Summer\n4. 📍 **Location** — Pune vs Nashik conditions differ\n\n👉 **Use the "Analyze My Land" feature** for AI-powered recommendations with risk scores and revenue estimates.\n\nOr tell me your soil type and I'll give quick suggestions!`;
  }
  // ─── Season Queries ────────────────────────────────────────────
  else if (lowercaseMsg.includes('kharif')) {
    reply = `🌧️ **Kharif Season Crops (June–October):**\n\n1. 🫘 Soybean — Low risk, rain-fed friendly\n2. 🌿 Cotton — High demand, MSP supported\n3. 🌽 Maize — Versatile, growing demand\n4. 🌾 Bajra — Minimal water, government push\n5. 🥜 Groundnut — Good for sandy/red soil\n\n💡 Kharif relies on monsoon — choose rain-tolerant varieties if no irrigation backup.`;
  }
  else if (lowercaseMsg.includes('rabi')) {
    reply = `❄️ **Rabi Season Crops (October–March):**\n\n1. 🌾 Wheat — Stable MSP, needs irrigation\n2. 🧅 Onion — High volume, Nashik specialty\n3. 🍅 Tomato — Good margins with drip\n4. 🌿 Jowar — Low input, safe returns\n5. 🍇 Grapes — Premium, needs expertise\n\n💡 Rabi crops need assured irrigation. Canal or borewell recommended.`;
  }
  else if (lowercaseMsg.includes('summer')) {
    reply = `☀️ **Summer Season Crops (March–June):**\n\n1. 🍎 Pomegranate — Heat-tolerant, premium\n2. 🌾 Sugarcane — Ratoon crop continues\n3. 🥜 Groundnut (Summer) — Quick turnaround\n4. 🍅 Tomato — Off-season premium prices\n\n⚠️ Water is critical in summer. Drip irrigation strongly recommended.`;
  }
  // ─── Platform Guide ────────────────────────────────────────────
  else if (lowercaseMsg.includes('how') || lowercaseMsg.includes('platform') || lowercaseMsg.includes('guide') || lowercaseMsg.includes('help') || lowercaseMsg.includes('start')) {
    reply = `🌟 **Welcome to AgriLease — Land Intelligence Platform!**\n\nHere's how to get started:\n\n1. 📊 **Analyze Land** — Enter your land details and get AI-powered crop recommendations with risk scores.\n2. 🔍 **Discover** — Browse verified lands available for leasing.\n3. 📋 **Dashboard** — Track your land profiles and past analysis reports.\n4. 💬 **Ask Me** — I can advise on crops, soil, seasons, and farming strategies.\n\n**Quick Actions:**\n• Tell me your soil type for crop suggestions\n• Ask about any specific crop's risk\n• Ask about Kharif/Rabi/Summer crops`;
  }
  // ─── Existing Leasing Queries ──────────────────────────────────
  else if (lowercaseMsg.includes('list land') || lowercaseMsg.includes('sell')) {
    reply = "To list your land, head over to the 'List Land' section on your Dashboard. You'll need your 7/12 extract document and basic details like acreage and expected lease price.";
  } 
  else if (lowercaseMsg.includes('find land') || lowercaseMsg.includes('lease') || lowercaseMsg.includes('rent')) {
    reply = "You can browse verified lands in the 'Discover' tab. Use the filters to narrow down by price, location, or area based on your farming needs.";
  } 
  else if (lowercaseMsg.includes('price') || lowercaseMsg.includes('cost') || lowercaseMsg.includes('how much') || lowercaseMsg.includes('revenue')) {
    reply = `💰 **Revenue Estimates by Crop (per acre/year):**\n\n• 🍇 Grapes: ₹3–12 lakh\n• 🍎 Pomegranate: ₹2.5–10 lakh\n• 🌾 Sugarcane: ₹1–2.5 lakh\n• 🧅 Onion: ₹60K–3.5 lakh\n• 🫘 Soybean: ₹27K–55K\n• 🌿 Cotton: ₹52K–1 lakh\n\n💡 Use **Analyze Land** for estimates specific to your land conditions.`;
  } 
  else if (lowercaseMsg.includes('water') || lowercaseMsg.includes('irrigation') || lowercaseMsg.includes('drip') || lowercaseMsg.includes('rain')) {
    reply = `💧 **Irrigation Guide:**\n\n• **Drip:** Best for grapes, pomegranate, tomato. Saves 40-60% water.\n• **Canal:** Good for sugarcane, wheat, paddy. Steady supply.\n• **Borewell:** Versatile. Check groundwater levels.\n• **Rain-fed:** Stick to bajra, jowar, groundnut, soybean.\n\n⚠️ **Avoid** sugarcane, grapes if rain-fed only.\n\n💡 Government subsidies available for drip/sprinkler installation (PMKSY).`;
  }
  else if (lowercaseMsg.includes('escrow') || lowercaseMsg.includes('agreement') || lowercaseMsg.includes('contract')) {
    reply = "🌟 **Secure Leasing on AgriLease:**\n1. **Discover & List:** Browse verified lands or list yours with 7/12 docs.\n2. **Digital Agreements:** Generate legally binding contracts instantly.\n3. **Escrow Payments:** Your advance payment is held securely in escrow until both parties finalize the lease.\n\nNeed help getting started? Ask me how to list or find land!";
  }

  // Simulate AI processing delay
  setTimeout(() => {
    res.json({ reply });
  }, 800);
});

module.exports = router;
