// ─── Chat Routes ─────────────────────────────────────────────────
// RESTful route definitions for the AI chatbot system

const express = require('express');
const router = express.Router();
const {
  handleChat,
  handlePersonalizedChat,
  getChatHistory,
  deleteChatHistory,
  getUserLands
} = require('../controllers/chatController');

// POST /api/chat — Basic chat (also handles backward-compatible /api/ai/chat)
router.post('/', handleChat);

// POST /api/chat/personalized — Personalized chat with land context
router.post('/personalized', handlePersonalizedChat);

// GET /api/chat/history/:userId — Get conversation history
router.get('/history/:userId', getChatHistory);

// DELETE /api/chat/history/:userId — Clear conversation history
router.delete('/history/:userId', deleteChatHistory);

// GET /api/chat/lands/:userId — Get user's land profiles for context selector
router.get('/lands/:userId', getUserLands);

module.exports = router;
