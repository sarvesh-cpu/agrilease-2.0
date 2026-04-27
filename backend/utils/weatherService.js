// ─── Enhanced Weather Service ────────────────────────────────────
// Provides seasonal weather data for Pune-Nashik region
// Uses OpenWeatherMap-style data structure (ready for real API swap)

const WEATHER_DATA = {
  Pune: {
    current: { temp: 32, humidity: 55, windSpeed: 12, description: 'Partly Cloudy', rainfall_mm: 0 },
    seasonal: {
      Kharif: { avgTemp: 27, avgRainfall: 720, humidity: 78, monsoonOnset: 'June 10-15', bestPlantWindow: 'June 15 - July 15', risks: ['Heavy rainfall in July', 'Waterlogging in low areas'] },
      Rabi: { avgTemp: 22, avgRainfall: 35, humidity: 45, bestPlantWindow: 'October 15 - November 15', risks: ['Frost in January (rare)', 'Dry spells in Feb'] },
      Summer: { avgTemp: 36, avgRainfall: 15, humidity: 30, bestPlantWindow: 'February - March', risks: ['Heat stress above 40°C', 'Water scarcity'] }
    },
    talukaSpecific: {
      'Baramati': { microclimate: 'Semi-arid', avgRainfall: 550, irrigationDependency: 'High', soilMoisture: 'Low' },
      'Haveli': { microclimate: 'Moderate', avgRainfall: 700, irrigationDependency: 'Medium', soilMoisture: 'Medium' },
      'Maval': { microclimate: 'Wet hilly', avgRainfall: 2500, irrigationDependency: 'Low', soilMoisture: 'High' },
      'Indapur': { microclimate: 'Dry', avgRainfall: 450, irrigationDependency: 'Very High', soilMoisture: 'Low' },
      'Junnar': { microclimate: 'Wet hilly', avgRainfall: 1800, irrigationDependency: 'Low', soilMoisture: 'High' },
      'Purandar': { microclimate: 'Semi-arid', avgRainfall: 600, irrigationDependency: 'High', soilMoisture: 'Medium' },
      'Shirur': { microclimate: 'Moderate', avgRainfall: 550, irrigationDependency: 'High', soilMoisture: 'Medium' },
      'Daund': { microclimate: 'Semi-arid', avgRainfall: 500, irrigationDependency: 'High', soilMoisture: 'Low' }
    }
  },
  Nashik: {
    current: { temp: 30, humidity: 50, windSpeed: 10, description: 'Clear', rainfall_mm: 0 },
    seasonal: {
      Kharif: { avgTemp: 26, avgRainfall: 850, humidity: 80, monsoonOnset: 'June 8-12', bestPlantWindow: 'June 10 - July 10', risks: ['Flash floods in ghats', 'Hailstorms in Sept-Oct'] },
      Rabi: { avgTemp: 20, avgRainfall: 25, humidity: 40, bestPlantWindow: 'October 10 - November 10', risks: ['Cold nights below 8°C', 'Grape frost damage'] },
      Summer: { avgTemp: 34, avgRainfall: 10, humidity: 25, bestPlantWindow: 'February - March', risks: ['Water table drop', 'Heat waves'] }
    },
    talukaSpecific: {
      'Nashik': { microclimate: 'Moderate', avgRainfall: 600, irrigationDependency: 'Medium', soilMoisture: 'Medium' },
      'Dindori': { microclimate: 'Wet', avgRainfall: 1200, irrigationDependency: 'Low', soilMoisture: 'High' },
      'Igatpuri': { microclimate: 'Very wet', avgRainfall: 3500, irrigationDependency: 'Very Low', soilMoisture: 'Very High' },
      'Niphad': { microclimate: 'Moderate', avgRainfall: 500, irrigationDependency: 'High', soilMoisture: 'Medium' },
      'Sinnar': { microclimate: 'Semi-arid', avgRainfall: 500, irrigationDependency: 'High', soilMoisture: 'Low' },
      'Malegaon': { microclimate: 'Dry', avgRainfall: 450, irrigationDependency: 'Very High', soilMoisture: 'Low' },
      'Yeola': { microclimate: 'Semi-arid', avgRainfall: 480, irrigationDependency: 'Very High', soilMoisture: 'Low' }
    }
  }
};

// APMC Market prices — Based on 2025-26 MSP (GOI) + APMC trading ranges
const MARKET_PRICES = {
  Sugarcane: { minPrice: 3150, maxPrice: 3550, avgPrice: 3550, unit: '₹/tonne', trend: 'stable', lastUpdated: '2025-26', note: 'FRP ₹355/quintal at 10.25% recovery' },
  Cotton: { minPrice: 7200, maxPrice: 8500, avgPrice: 7710, unit: '₹/quintal', trend: 'stable', lastUpdated: '2025-26', note: 'MSP Medium Staple ₹7,710; Long Staple ₹8,110' },
  Soybean: { minPrice: 4800, maxPrice: 5800, avgPrice: 5328, unit: '₹/quintal', trend: 'stable', lastUpdated: '2025-26', note: 'MSP Yellow ₹5,328' },
  Onion: { minPrice: 800, maxPrice: 5000, avgPrice: 2200, unit: '₹/quintal', trend: 'volatile', lastUpdated: '2025-26', note: 'Highly seasonal, Nashik APMC benchmark' },
  Grapes: { minPrice: 30000, maxPrice: 90000, avgPrice: 50000, unit: '₹/tonne', trend: 'seasonal', lastUpdated: '2025-26', note: 'Export quality: ₹60-90K, Table: ₹30-50K' },
  Pomegranate: { minPrice: 50000, maxPrice: 150000, avgPrice: 80000, unit: '₹/tonne', trend: 'rising', lastUpdated: '2025-26', note: 'Bhagwa variety commands premium' },
  Tomato: { minPrice: 500, maxPrice: 6000, avgPrice: 1800, unit: '₹/quintal', trend: 'volatile', lastUpdated: '2025-26', note: 'Extreme price swings Jun-Aug' },
  Wheat: { minPrice: 2400, maxPrice: 2800, avgPrice: 2585, unit: '₹/quintal', trend: 'stable', lastUpdated: '2025-26', note: 'MSP RMS 2026-27: ₹2,585' },
  Bajra: { minPrice: 2500, maxPrice: 3000, avgPrice: 2775, unit: '₹/quintal', trend: 'stable', lastUpdated: '2025-26', note: 'MSP Kharif 2025-26: ₹2,775' },
  Jowar: { minPrice: 3200, maxPrice: 4000, avgPrice: 3699, unit: '₹/quintal', trend: 'stable', lastUpdated: '2025-26', note: 'MSP Hybrid: ₹3,699; Maldandi: ₹3,749' },
  Maize: { minPrice: 2200, maxPrice: 2700, avgPrice: 2400, unit: '₹/quintal', trend: 'stable', lastUpdated: '2025-26', note: 'MSP Kharif 2025-26: ₹2,400' },
  Groundnut: { minPrice: 6500, maxPrice: 8000, avgPrice: 7263, unit: '₹/quintal', trend: 'rising', lastUpdated: '2025-26', note: 'MSP Kharif 2025-26: ₹7,263' }
};

/**
 * Get weather data for a district/taluka
 */
function getWeatherData(district, taluka, season) {
  const districtData = WEATHER_DATA[district] || WEATHER_DATA.Pune;
  const result = {
    current: districtData.current,
    seasonal: season ? districtData.seasonal[season] : districtData.seasonal,
    taluka: districtData.talukaSpecific?.[taluka] || null,
    source: 'Regional Weather Database (Pune-Nashik)',
    disclaimer: 'Based on 10-year average data. For live forecasts, check IMD.'
  };
  return result;
}

/**
 * Get market prices for crops
 */
function getMarketPrices(cropNames) {
  if (!cropNames || cropNames.length === 0) return MARKET_PRICES;
  const result = {};
  cropNames.forEach(crop => {
    if (MARKET_PRICES[crop]) result[crop] = MARKET_PRICES[crop];
  });
  return result;
}

/**
 * Get comprehensive advisory context
 */
function getAdvisoryContext(district, taluka, season) {
  const weather = getWeatherData(district, taluka, season);
  const prices = getMarketPrices();
  return { weather, marketPrices: prices };
}

module.exports = { getWeatherData, getMarketPrices, getAdvisoryContext, MARKET_PRICES };
