const express = require('express');
const router = express.Router();
const db = require('../db');

// ─── Crop Intelligence Database ───────────────────────────────────
const CROP_DATABASE = {
  cotton: {
    name: 'Cotton', icon: '🌿',
    yieldRange: [8, 12], unit: 'quintals/acre',
    priceRange: [6500, 8500], priceUnit: '₹/quintal',
    waterNeed: 'Medium', waterScore: 3,
    seasons: ['Kharif'],
    soils: ['Black', 'Loamy'],
    irrigations: ['Canal', 'Borewell', 'Rain-fed'],
    description: 'Cotton thrives in black soil with moderate water. Strong market demand in Maharashtra with reliable MSP support.'
  },
  soybean: {
    name: 'Soybean', icon: '🫘',
    yieldRange: [6, 10], unit: 'quintals/acre',
    priceRange: [4500, 5500], priceUnit: '₹/quintal',
    waterNeed: 'Low', waterScore: 2,
    seasons: ['Kharif'],
    soils: ['Black', 'Loamy', 'Red'],
    irrigations: ['Rain-fed', 'Canal', 'Borewell'],
    description: 'Soybean is ideal for rain-fed conditions with minimal investment. Nashik and Pune districts have strong processing infrastructure.'
  },
  sugarcane: {
    name: 'Sugarcane', icon: '🌾',
    yieldRange: [35, 50], unit: 'tonnes/acre',
    priceRange: [3000, 3500], priceUnit: '₹/tonne',
    waterNeed: 'Very High', waterScore: 5,
    seasons: ['Kharif', 'Summer'],
    soils: ['Black', 'Loamy'],
    irrigations: ['Canal', 'Drip', 'Borewell'],
    description: 'Sugarcane offers high revenue but requires heavy water. Best with drip irrigation in Pune belt. Cooperative sugar factories ensure guaranteed buyers.'
  },
  grapes: {
    name: 'Grapes', icon: '🍇',
    yieldRange: [8, 15], unit: 'tonnes/acre',
    priceRange: [40000, 80000], priceUnit: '₹/tonne',
    waterNeed: 'Medium', waterScore: 3,
    seasons: ['Rabi', 'Summer'],
    soils: ['Red', 'Sandy', 'Loamy'],
    irrigations: ['Drip'],
    description: 'Nashik is India\'s grape capital. Drip irrigation is mandatory. High revenue potential with export markets, but requires skilled management.'
  },
  pomegranate: {
    name: 'Pomegranate', icon: '🍎',
    yieldRange: [4, 8], unit: 'tonnes/acre',
    priceRange: [60000, 120000], priceUnit: '₹/tonne',
    waterNeed: 'Low', waterScore: 2,
    seasons: ['Rabi', 'Summer'],
    soils: ['Red', 'Sandy', 'Loamy'],
    irrigations: ['Drip', 'Borewell'],
    description: 'Drought-resistant and high-value. Excellent for water-scarce areas in Nashik-Pune. Export quality fetches premium prices.'
  },
  onion: {
    name: 'Onion', icon: '🧅',
    yieldRange: [60, 100], unit: 'quintals/acre',
    priceRange: [1000, 3500], priceUnit: '₹/quintal',
    waterNeed: 'Medium', waterScore: 3,
    seasons: ['Kharif', 'Rabi'],
    soils: ['Red', 'Loamy', 'Black'],
    irrigations: ['Drip', 'Borewell', 'Canal'],
    description: 'Nashik is India\'s onion hub. High volume crop with volatile but potentially very profitable pricing. Cold storage adds value.'
  },
  tomato: {
    name: 'Tomato', icon: '🍅',
    yieldRange: [80, 120], unit: 'quintals/acre',
    priceRange: [800, 2500], priceUnit: '₹/quintal',
    waterNeed: 'Medium', waterScore: 3,
    seasons: ['Rabi', 'Summer'],
    soils: ['Red', 'Loamy', 'Sandy'],
    irrigations: ['Drip', 'Borewell'],
    description: 'High-yield vegetable crop ideal for drip irrigation. Pune markets provide consistent demand. Price volatility is the main risk.'
  },
  bajra: {
    name: 'Bajra (Pearl Millet)', icon: '🌾',
    yieldRange: [5, 8], unit: 'quintals/acre',
    priceRange: [2500, 3200], priceUnit: '₹/quintal',
    waterNeed: 'Very Low', waterScore: 1,
    seasons: ['Kharif'],
    soils: ['Sandy', 'Red', 'Loamy'],
    irrigations: ['Rain-fed'],
    description: 'Perfect for rain-fed and water-scarce land. Low investment, guaranteed MSP. Government push for millets increases market potential.'
  },
  jowar: {
    name: 'Jowar (Sorghum)', icon: '🌿',
    yieldRange: [5, 9], unit: 'quintals/acre',
    priceRange: [3000, 3800], priceUnit: '₹/quintal',
    waterNeed: 'Very Low', waterScore: 1,
    seasons: ['Kharif', 'Rabi'],
    soils: ['Black', 'Red', 'Sandy'],
    irrigations: ['Rain-fed', 'Borewell'],
    description: 'Traditional Maharashtrian crop with low risk. Dual-purpose — grain and fodder. Strong local consumption demand.'
  },
  maize: {
    name: 'Maize', icon: '🌽',
    yieldRange: [12, 18], unit: 'quintals/acre',
    priceRange: [2000, 2800], priceUnit: '₹/quintal',
    waterNeed: 'Medium', waterScore: 3,
    seasons: ['Kharif', 'Rabi'],
    soils: ['Loamy', 'Black', 'Red'],
    irrigations: ['Canal', 'Borewell', 'Rain-fed'],
    description: 'Versatile crop used in food, feed, and industry. Growing demand from poultry sector. Reliable yields in Pune-Nashik region.'
  },
  groundnut: {
    name: 'Groundnut', icon: '🥜',
    yieldRange: [6, 10], unit: 'quintals/acre',
    priceRange: [5500, 7000], priceUnit: '₹/quintal',
    waterNeed: 'Low', waterScore: 2,
    seasons: ['Kharif', 'Summer'],
    soils: ['Sandy', 'Red', 'Loamy'],
    irrigations: ['Rain-fed', 'Borewell'],
    description: 'Oil seed with consistent demand. Low water requirement and nitrogen-fixing properties improve soil health for next season.'
  },
  wheat: {
    name: 'Wheat', icon: '🌾',
    yieldRange: [10, 15], unit: 'quintals/acre',
    priceRange: [2200, 2800], priceUnit: '₹/quintal',
    waterNeed: 'Medium', waterScore: 3,
    seasons: ['Rabi'],
    soils: ['Black', 'Loamy'],
    irrigations: ['Canal', 'Borewell'],
    description: 'Staple Rabi crop with guaranteed MSP procurement. Requires assured irrigation but provides stable, low-risk returns.'
  }
};

// ─── Recommendation Engine ────────────────────────────────────────
function analyzeLand(profile) {
  const { district, taluka, soilType, irrigationType, previousCrop, season, area } = profile;
  
  const scores = {};
  
  // Score each crop
  for (const [key, crop] of Object.entries(CROP_DATABASE)) {
    let score = 0;
    let factors = [];
    
    // Soil compatibility (most important - 30 points)
    if (crop.soils.includes(soilType)) {
      score += 30;
      factors.push(`Excellent soil match — ${soilType} soil is ideal`);
    } else {
      score -= 20;
      factors.push(`${soilType} soil is not optimal for this crop`);
    }
    
    // Season compatibility (25 points)
    if (crop.seasons.includes(season)) {
      score += 25;
      factors.push(`${season} is the right growing season`);
    } else {
      score -= 30;
      factors.push(`Not typically grown in ${season} season`);
    }
    
    // Irrigation compatibility (25 points)
    if (crop.irrigations.includes(irrigationType)) {
      score += 25;
      factors.push(`Compatible with ${irrigationType} irrigation`);
    } else {
      score -= 15;
      factors.push(`May need different irrigation than ${irrigationType}`);
    }
    
    // Water availability check
    if (irrigationType === 'Rain-fed' && crop.waterScore >= 4) {
      score -= 25;
      factors.push('⚠ Too water-intensive for rain-fed farming');
    }
    if (irrigationType === 'Drip' && crop.waterScore <= 2) {
      score += 10;
      factors.push('Efficient water use with drip irrigation');
    }
    
    // District bonus
    if (district === 'Nashik' && ['grapes', 'onion', 'pomegranate', 'tomato'].includes(key)) {
      score += 15;
      factors.push(`${district} is a major hub for this crop`);
    }
    if (district === 'Pune' && ['sugarcane', 'soybean', 'maize', 'wheat'].includes(key)) {
      score += 15;
      factors.push(`${district} belt is known for this crop`);
    }
    
    // Crop rotation bonus (avoid same crop)
    if (previousCrop && previousCrop.toLowerCase() === crop.name.toLowerCase()) {
      score -= 10;
      factors.push('Crop rotation recommended — avoid repeating');
    }
    
    // Area suitability
    if (area < 3 && crop.waterScore >= 4) {
      score -= 5;
      factors.push('Small land area may limit returns for this water-intensive crop');
    }
    if (area >= 5 && ['grapes', 'pomegranate'].includes(key)) {
      score += 5;
      factors.push('Good land size for commercial cultivation');
    }
    
    // Revenue potential bonus
    const minRevenue = crop.yieldRange[0] * crop.priceRange[0];
    const maxRevenue = crop.yieldRange[1] * crop.priceRange[1];
    if (maxRevenue > 500000) {
      score += 5; // Bonus for high-value crops
    }
    
    scores[key] = {
      ...crop,
      key,
      score: Math.max(0, score),
      factors: factors.filter(f => score > 0 || !f.includes('Excellent')),
      minRevenue: Math.round(minRevenue * area),
      maxRevenue: Math.round(maxRevenue * area),
      risk: calculateRisk(score, crop, irrigationType, season)
    };
  }
  
  // Sort by score and return top 3
  const sorted = Object.values(scores).sort((a, b) => b.score - a.score);
  return sorted.slice(0, 3).map((crop, index) => ({
    rank: index + 1,
    key: crop.key,
    name: crop.name,
    icon: crop.icon,
    score: crop.score,
    risk: crop.risk,
    yieldRange: `${crop.yieldRange[0]}–${crop.yieldRange[1]} ${crop.unit}`,
    revenueMin: crop.minRevenue,
    revenueMax: crop.maxRevenue,
    waterNeed: crop.waterNeed,
    waterCompatible: crop.irrigations.includes(irrigationType),
    description: crop.description,
    factors: crop.factors.slice(0, 3)
  }));
}

function calculateRisk(score, crop, irrigation, season) {
  if (score >= 60) return { level: 'Low', color: '#22c55e' };
  if (score >= 35) return { level: 'Medium', color: '#f59e0b' };
  return { level: 'High', color: '#ef4444' };
}

// ─── API Routes ───────────────────────────────────────────────────

// POST /api/analysis — Run crop analysis
router.post('/', (req, res) => {
  const { district, taluka, area, soilType, irrigationType, previousCrop, season, userId, landName } = req.body;
  
  if (!district || !soilType || !irrigationType || !season) {
    return res.status(400).json({ error: 'Missing required fields: district, soilType, irrigationType, season' });
  }
  
  const profile = { district, taluka, area: parseFloat(area) || 5, soilType, irrigationType, previousCrop, season };
  const recommendations = analyzeLand(profile);
  
  // Save to database
  const profileData = { userId: userId || null, name: landName || 'My Land', ...profile };
  
  db.run(
    `INSERT INTO land_profiles (userId, name, district, taluka, area, soilType, irrigationType, previousCrop, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [profileData.userId, profileData.name, district, taluka || '', profileData.area, soilType, irrigationType, previousCrop || '', season],
    function(err) {
      if (err) {
        console.error('Error saving land profile:', err);
        // Still return analysis even if save fails
        return res.json({ recommendations, landProfileId: null });
      }
      
      const landProfileId = this.lastID;
      
      db.run(
        `INSERT INTO analysis_results (landProfileId, recommendations) VALUES (?, ?)`,
        [landProfileId, JSON.stringify(recommendations)],
        function(err2) {
          if (err2) console.error('Error saving analysis:', err2);
          
          res.json({
            landProfileId,
            analysisId: this ? this.lastID : null,
            profile: profileData,
            recommendations
          });
        }
      );
    }
  );
});

// GET /api/analysis/history — Get past analysis results
router.get('/history', (req, res) => {
  db.all(
    `SELECT ar.id as analysisId, ar.landProfileId, ar.recommendations, ar.createdAt,
            lp.name, lp.district, lp.taluka, lp.area, lp.soilType, lp.irrigationType, lp.season
     FROM analysis_results ar
     JOIN land_profiles lp ON ar.landProfileId = lp.id
     ORDER BY ar.createdAt DESC
     LIMIT 20`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch history' });
      }
      const results = rows.map(row => ({
        ...row,
        recommendations: JSON.parse(row.recommendations)
      }));
      res.json(results);
    }
  );
});

// GET /api/analysis/:id — Get single analysis
router.get('/:id', (req, res) => {
  db.get(
    `SELECT ar.id as analysisId, ar.landProfileId, ar.recommendations, ar.createdAt,
            lp.name, lp.district, lp.taluka, lp.area, lp.soilType, lp.irrigationType, lp.previousCrop, lp.season
     FROM analysis_results ar
     JOIN land_profiles lp ON ar.landProfileId = lp.id
     WHERE ar.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: 'Analysis not found' });
      }
      res.json({
        ...row,
        recommendations: JSON.parse(row.recommendations)
      });
    }
  );
});

module.exports = router;
