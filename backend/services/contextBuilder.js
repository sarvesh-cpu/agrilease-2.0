// ─── Context Builder Service ─────────────────────────────────────
// Fetches user's land data and builds the full AI prompt with context

const db = require('../db');
const { SYSTEM_PROMPT, CONTEXT_TEMPLATE, NO_LAND_CONTEXT } = require('../utils/systemPrompt');
const { getWeatherAdvisory } = require('../utils/weatherService');
const { applyRules } = require('./ruleEngine');

/**
 * Fetch user's land profiles from database
 * @param {number|string} userId
 * @returns {Promise<Array>} Land profiles
 */
function fetchUserLands(userId) {
  return new Promise((resolve, reject) => {
    if (!userId) return resolve([]);
    db.all(
      `SELECT * FROM land_profiles WHERE userId = ? ORDER BY createdAt DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          console.error('Error fetching user lands:', err);
          return resolve([]);
        }
        resolve(rows || []);
      }
    );
  });
}

/**
 * Fetch a specific land profile by ID
 * @param {number|string} landId
 * @returns {Promise<object|null>}
 */
function fetchLandById(landId) {
  return new Promise((resolve, reject) => {
    if (!landId) return resolve(null);
    db.get(
      `SELECT * FROM land_profiles WHERE id = ?`,
      [landId],
      (err, row) => {
        if (err) {
          console.error('Error fetching land:', err);
          return resolve(null);
        }
        resolve(row || null);
      }
    );
  });
}

/**
 * Fetch recent conversation history for a user
 * @param {number|string} userId
 * @param {number} limit
 * @returns {Promise<Array>}
 */
function fetchConversationHistory(userId, limit = 10) {
  return new Promise((resolve, reject) => {
    if (!userId) return resolve([]);
    db.all(
      `SELECT role, message FROM chat_sessions WHERE userId = ? ORDER BY createdAt DESC LIMIT ?`,
      [userId, limit],
      (err, rows) => {
        if (err) {
          console.error('Error fetching chat history:', err);
          return resolve([]);
        }
        // Reverse to get chronological order
        resolve((rows || []).reverse());
      }
    );
  });
}

/**
 * Save a chat message to session history
 * @param {number|string} userId
 * @param {string} role - 'user' or 'assistant'
 * @param {string} message
 * @param {number|null} landId
 */
function saveChatMessage(userId, role, message, landId = null) {
  if (!userId) return;
  db.run(
    `INSERT INTO chat_sessions (userId, role, message, activeLandId) VALUES (?, ?, ?, ?)`,
    [userId, role, message, landId],
    (err) => {
      if (err) console.error('Error saving chat message:', err);
    }
  );
}

/**
 * Clear conversation history for a user
 * @param {number|string} userId
 * @returns {Promise<number>} Number of deleted rows
 */
function clearHistory(userId) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM chat_sessions WHERE userId = ?`, [userId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

/**
 * Format land data as natural language context
 * @param {object} land
 * @returns {string}
 */
function formatLandContext(land) {
  if (!land) return '';
  return `${land.name || 'Unnamed Land'} — ${land.area} acres of ${land.soilType} soil in ${land.taluka}, ${land.district}. Irrigation: ${land.irrigationType}. Previous crop: ${land.previousCrop || 'None'}. Season: ${land.season}.`;
}

/**
 * Build the full system prompt with all context injected
 * @param {string} userMessage - The user's chat message
 * @param {object|null} landData - Active land profile
 * @param {Array} conversationHistory - Recent chat messages
 * @returns {object} { systemPrompt, enhancedMessage }
 */
function buildFullPrompt(userMessage, landData, conversationHistory) {
  let contextBlock;

  if (landData) {
    // Get rule-based insights
    const ruleResults = applyRules(userMessage, landData);
    
    // Get weather advisory
    const weatherAdvisory = getWeatherAdvisory(landData.district, landData.season);

    // Format conversation history
    const historyStr = conversationHistory.length > 0
      ? conversationHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.message}`).join('\n')
      : '(No previous conversation)';

    // Build the context block
    contextBlock = CONTEXT_TEMPLATE
      .replace('{{landName}}', landData.name || 'My Land')
      .replace('{{taluka}}', landData.taluka || 'N/A')
      .replace('{{district}}', landData.district || 'N/A')
      .replace('{{area}}', landData.area || 'N/A')
      .replace('{{soilType}}', landData.soilType || 'N/A')
      .replace('{{irrigationType}}', landData.irrigationType || 'N/A')
      .replace('{{previousCrop}}', landData.previousCrop || 'None')
      .replace('{{season}}', landData.season || 'N/A')
      .replace('{{ruleInsights}}', [
        ruleResults.insights,
        ruleResults.riskInfo ? `\nRisk Analysis: ${ruleResults.riskInfo}` : '',
        ruleResults.suggestedCrops.length > 0 ? `\nRule-suggested crops: ${ruleResults.suggestedCrops.join(', ')}` : '',
        `\nWeather: ${weatherAdvisory}`
      ].filter(Boolean).join('\n'))
      .replace('{{conversationHistory}}', historyStr)
      .replace('{{userMessage}}', userMessage);
  } else {
    contextBlock = NO_LAND_CONTEXT + `\n\nUSER'S QUESTION:\n${userMessage}`;
    
    // Still format conversation history if available
    if (conversationHistory.length > 0) {
      const historyStr = conversationHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.message}`).join('\n');
      contextBlock += `\n\nCONVERSATION HISTORY:\n${historyStr}`;
    }
  }

  return {
    systemPrompt: SYSTEM_PROMPT,
    enhancedMessage: contextBlock
  };
}

module.exports = {
  fetchUserLands,
  fetchLandById,
  fetchConversationHistory,
  saveChatMessage,
  clearHistory,
  formatLandContext,
  buildFullPrompt
};
