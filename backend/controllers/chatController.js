// ─── Chat Controller ─────────────────────────────────────────────
// Handles all chat-related request processing and validation

const { generateResponse } = require('../services/aiService');
const {
  fetchUserLands,
  fetchLandById,
  fetchConversationHistory,
  saveChatMessage,
  clearHistory,
  buildFullPrompt,
  formatLandContext
} = require('../services/contextBuilder');

/**
 * POST /api/chat — Basic chat (backward compatible with old /api/ai/chat)
 * Accepts: { message, image, userId?, activeLandId? }
 */
async function handleChat(req, res) {
  try {
    const { message, image, userId, activeLandId } = req.body;

    // Validate
    if (!message && !image) {
      return res.status(400).json({ error: 'Message is required', reply: 'Please provide a message.' });
    }

    // Handle image analysis (mock)
    if (image) {
      const reply = `I've analyzed the image of your land. Based on the visual texture and color, this appears to be **Red Laterite Soil** mixed with loamy characteristics, typical in parts of Maharashtra.\n\n🌱 **Suggested Crops:** Groundnuts, Cashews, Sugarcane, or Millets.\n💧 **Water Retention:** Moderate to low. Drip irrigation recommended.\n📊 **Next Step:** Use **Analyze My Land** for a detailed, data-driven recommendation.\n\nWould you like me to help you start an analysis?`;
      return res.json({ reply, personalized: false });
    }

    // Fetch land context if userId provided
    let landData = null;
    let conversationHistory = [];

    if (userId) {
      // Fetch specific land or most recent
      if (activeLandId) {
        landData = await fetchLandById(activeLandId);
      } else {
        const lands = await fetchUserLands(userId);
        landData = lands.length > 0 ? lands[0] : null; // Use most recent
      }

      // Fetch conversation history
      conversationHistory = await fetchConversationHistory(userId, 10);

      // Save user message to history
      saveChatMessage(userId, 'user', message, activeLandId || (landData ? landData.id : null));
    }

    // Build context-injected prompt
    const { systemPrompt, enhancedMessage } = buildFullPrompt(message, landData, conversationHistory);

    // Generate AI response (Gemini or fallback)
    const reply = await generateResponse(systemPrompt, enhancedMessage, message, landData);

    // Save assistant response to history
    if (userId) {
      saveChatMessage(userId, 'assistant', reply, activeLandId || (landData ? landData.id : null));
    }

    res.json({
      reply,
      personalized: !!landData,
      activeLand: landData ? {
        id: landData.id,
        name: landData.name,
        summary: formatLandContext(landData)
      } : null
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Failed to generate response',
      reply: '⚠️ Something went wrong. Please try again in a moment.'
    });
  }
}

/**
 * POST /api/chat/personalized — Personalized chat with explicit land selection
 * Accepts: { message, userId, activeLandId? }
 */
async function handlePersonalizedChat(req, res) {
  try {
    const { message, userId, activeLandId } = req.body;

    // Validate
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!userId) {
      return res.status(400).json({
        error: 'userId is required for personalized chat',
        reply: '⚠️ Please log in to get personalized crop advice based on your land data.'
      });
    }

    // Fetch user's lands
    const userLands = await fetchUserLands(userId);

    if (userLands.length === 0) {
      // No land profiles — still respond but ask for data
      const conversationHistory = await fetchConversationHistory(userId, 10);
      saveChatMessage(userId, 'user', message, null);

      const { systemPrompt, enhancedMessage } = buildFullPrompt(message, null, conversationHistory);
      const reply = await generateResponse(systemPrompt, enhancedMessage, message, null);

      saveChatMessage(userId, 'assistant', reply, null);

      return res.json({
        reply,
        personalized: false,
        lands: [],
        message: 'No land profiles found. Add a land profile via /analyze for personalized advice.'
      });
    }

    // Select active land
    let activeLand;
    if (activeLandId) {
      activeLand = userLands.find(l => l.id === parseInt(activeLandId));
      if (!activeLand) {
        return res.status(404).json({ error: `Land profile ${activeLandId} not found for this user` });
      }
    } else {
      activeLand = userLands[0]; // Default to most recent
    }

    // Fetch conversation history
    const conversationHistory = await fetchConversationHistory(userId, 10);

    // Save user message
    saveChatMessage(userId, 'user', message, activeLand.id);

    // Build and generate
    const { systemPrompt, enhancedMessage } = buildFullPrompt(message, activeLand, conversationHistory);
    const reply = await generateResponse(systemPrompt, enhancedMessage, message, activeLand);

    // Save assistant reply
    saveChatMessage(userId, 'assistant', reply, activeLand.id);

    res.json({
      reply,
      personalized: true,
      activeLand: {
        id: activeLand.id,
        name: activeLand.name,
        summary: formatLandContext(activeLand)
      },
      availableLands: userLands.map(l => ({
        id: l.id,
        name: l.name,
        summary: `${l.area} acres, ${l.soilType} soil, ${l.taluka}`
      }))
    });

  } catch (err) {
    console.error('Personalized chat error:', err);
    res.status(500).json({
      error: 'Failed to generate personalized response',
      reply: '⚠️ Something went wrong. Please try again.'
    });
  }
}

/**
 * GET /api/chat/history/:userId — Get conversation history
 */
async function getChatHistory(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const history = await fetchConversationHistory(userId, 50);
    res.json({ userId, messages: history });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
}

/**
 * DELETE /api/chat/history/:userId — Clear conversation history
 */
async function deleteChatHistory(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const deleted = await clearHistory(userId);
    res.json({ userId, deletedMessages: deleted, message: 'Chat history cleared' });
  } catch (err) {
    console.error('Delete history error:', err);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
}

/**
 * GET /api/chat/lands/:userId — Get user's available land profiles for chat context
 */
async function getUserLands(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const lands = await fetchUserLands(userId);
    res.json({
      userId,
      lands: lands.map(l => ({
        id: l.id,
        name: l.name,
        district: l.district,
        taluka: l.taluka,
        area: l.area,
        soilType: l.soilType,
        irrigationType: l.irrigationType,
        season: l.season,
        summary: formatLandContext(l)
      }))
    });
  } catch (err) {
    console.error('Fetch lands error:', err);
    res.status(500).json({ error: 'Failed to fetch land profiles' });
  }
}

module.exports = {
  handleChat,
  handlePersonalizedChat,
  getChatHistory,
  deleteChatHistory,
  getUserLands
};
