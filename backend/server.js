require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Route imports
const chatRoutes = require('./routes/chatRoutes');
const analysisRouter = require('./routes/analysis');
const landsRouter = require('./routes/lands');
const usersRouter = require('./routes/users');
const documentRoutes = require('./routes/documentRoutes');
const { getMarketPrices, getWeatherData } = require('./utils/weatherService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    name: 'AgriLease Land Intelligence API',
    version: '2.0.0',
    endpoints: {
      chat: 'POST /api/chat',
      personalizedChat: 'POST /api/chat/personalized',
      chatHistory: 'GET /api/chat/history/:userId',
      chatLands: 'GET /api/chat/lands/:userId',
      analysis: 'POST /api/analysis',
      lands: 'GET /api/lands',
      users: 'POST /api/users/register | POST /api/users/login',
      document: 'POST /api/document/extract-712',
      market: 'GET /api/market/prices',
      weather: 'GET /api/weather/:district'
    }
  });
});

// ─── Route Mounts ─────────────────────────────────────────────────
app.use('/api/chat', chatRoutes);
app.use('/api/analysis', analysisRouter);
app.use('/api/lands', landsRouter);
app.use('/api/users', usersRouter);
app.use('/api/document', documentRoutes);

// ─── Market Data API ──────────────────────────────────────────────
app.get('/api/market/prices', (req, res) => {
  const crops = req.query.crops ? req.query.crops.split(',') : [];
  res.json({ prices: getMarketPrices(crops.length ? crops : null), source: 'APMC Regional Data', lastUpdated: '2025-04' });
});

app.get('/api/weather/:district', (req, res) => {
  const { district } = req.params;
  const { taluka, season } = req.query;
  res.json(getWeatherData(district, taluka, season));
});

// ─── Backward Compatibility ──────────────────────────────────────
app.post('/api/ai/chat', (req, res, next) => {
  req.url = '/';
  chatRoutes.handle(req, res, next);
});

// ─── Global Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', reply: '⚠️ Something went wrong. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`\n🌱 AgriLease API running on http://localhost:${PORT}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Connected' : '❌ Not configured (rule-based fallback)'}`);
  console.log(`   JWT Auth:   ✅ Enabled`);
  console.log(`   Market API: ✅ 12 crops\n`);
});
