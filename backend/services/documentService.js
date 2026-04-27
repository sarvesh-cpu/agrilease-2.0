// ─── 7/12 Document Extraction Service ────────────────────────────
// Uses Gemini Vision API to extract structured data from Maharashtra
// 7/12 (Satbara) land record documents
//
// 7/12 Document Structure:
//   FORM 7 (Record of Rights):
//     - District, Taluka, Village, Survey/Gut No.
//     - Occupant name, Khata No., Total Area (Hectare)
//     - Assessment value, Other Rights (loans etc.)
//   FORM 12 (Register of Crops):
//     - Year, Season, Crop Name, Area, Source of Irrigation

require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const EXTRACTION_PROMPT = `You are an expert at reading Maharashtra 7/12 (Satbara Utara) land record documents. These documents contain two forms:

FORM 7 (गांव नमुना ७ - Record of Rights) — Contains land ownership details.
FORM 12 (गांव नमुना १२ - Register of Crops) — Contains agricultural activity for the current year.

Analyze the uploaded document image and extract the following fields. Return ONLY a valid JSON object, no markdown, no explanation:

{
  "district": "District name in English (e.g., Pune, Nashik)",
  "taluka": "Taluka name in English",
  "village": "Village name in English",
  "surveyNumber": "Survey/Gut number as string",
  "subDivision": "Sub-division/Hissa number",
  "ownerName": "Full name of occupant/owner in English",
  "khataNumber": "Khata number as string",
  "totalAreaHectare": "Total area as number in hectares (e.g., 1.5)",
  "totalAreaAcres": "Total area converted to acres (1 hectare = 2.47 acres, round to 1 decimal)",
  "assessmentValue": "Assessment value in rupees as number",
  "occupantClass": "Occupant class (e.g., Class 1)",
  "otherRights": "Any loans, mortgages, or encumbrances mentioned",
  "cropEntries": [
    {
      "year": "Year as string (e.g., 2024-25)",
      "season": "Season in English: Kharif, Rabi, or Summer",
      "cropName": "Crop name in English (e.g., Sugarcane, Onion, Cotton)",
      "areaHectare": "Area for this crop in hectares as number",
      "irrigationSource": "Source of irrigation in English (e.g., Well, Canal, Drip, Borewell, Rain-fed)"
    }
  ],
  "soilType": "Infer soil type if possible from region/crops, one of: Black, Red, Sandy, Loamy. If unclear, return null",
  "confidence": "Your confidence in extraction accuracy: high, medium, or low"
}

IMPORTANT RULES:
1. Translate ALL Marathi text to English.
2. Convert Devanagari numerals to Arabic (१=1, २=2, etc.).
3. Hectare format in these documents: 1.50.00 means 1 hectare and 50 ares = 1.50 hectares.
4. If a field is not visible or unclear, use null.
5. Map irrigation sources: विहीर=Well/Borewell, कालवा=Canal, ठिबक=Drip, कोरडवाहू=Rain-fed, पाट=Canal.
6. Map seasons: खरीप=Kharif, रब्बी=Rabi, उन्हाळी=Summer.
7. Map crops: ऊस=Sugarcane, कापूस=Cotton, सोयाबीन=Soybean, कांदा=Onion, द्राक्ष=Grapes, डाळिंब=Pomegranate, टोमॅटो=Tomato, गहू=Wheat, बाजरी=Bajra, ज्वारी=Jowar, मका=Maize, भुईमूग=Groundnut.
8. For soil type inference: Pune-Baramati-Indapur typically = Black soil. Nashik hills = Red. Western Maharashtra plains = Black/Loamy.
9. Return ONLY the JSON object, nothing else.`;


/**
 * Extract data from a 7/12 document image using Gemini Vision
 * @param {string} base64Image - Base64 encoded image data (with or without data URI prefix)
 * @param {string} mimeType - Image MIME type (e.g., 'image/png', 'image/jpeg')
 * @returns {Promise<object>} Extracted document data
 */
async function extract712Document(base64Image, mimeType = 'image/jpeg') {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required for document extraction. Set it in .env file.');
  }

  // Strip data URI prefix if present
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1, // Low temperature for factual extraction
      maxOutputTokens: 1500,
      topP: 0.8
    }
  };

  // Try up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        
        // 429 = Quota exceeded — don't retry, fail immediately with clear message
        if (response.status === 429) {
          throw new Error('QUOTA_EXCEEDED: Gemini API free tier quota exceeded. Please wait a minute and try again, or upgrade your API plan at https://ai.google.dev.');
        }
        
        // 503 / 500 = temporary server error — retry
        if (response.status >= 500 && attempt < 3) {
          console.warn(`Gemini server error ${response.status}, retrying...`);
          await new Promise(r => setTimeout(r, 2000 * attempt));
          continue;
        }
        
        throw new Error(`Gemini API ${response.status}: ${errText.slice(0, 200)}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error('Empty response from Gemini Vision');

      // Parse JSON from response (handle markdown code blocks)
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const extracted = JSON.parse(jsonStr);

      // Post-process: map extracted data to form fields
      return mapToFormFields(extracted);

    } catch (err) {
      // Don't retry quota errors
      if (err.message.startsWith('QUOTA_EXCEEDED')) {
        throw new Error(err.message.replace('QUOTA_EXCEEDED: ', ''));
      }
      
      console.error(`Document extraction attempt ${attempt}/3 failed:`, err.message);
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 2000 * attempt));
      } else {
        throw err;
      }
    }
  }
}

/**
 * Map extracted 7/12 data to the LandAnalysis form fields
 * @param {object} extracted - Raw extracted data from Gemini
 * @returns {object} Mapped form data + raw document data
 */
function mapToFormFields(extracted) {
  // Map district to our supported values
  const districtMap = {
    'pune': 'Pune',
    'nashik': 'Nashik',
    'nasik': 'Nashik'
  };
  const district = districtMap[(extracted.district || '').toLowerCase()] || extracted.district || '';

  // Map taluka name to match our TALUKAS list
  const TALUKAS = {
    Pune: ['Pune City', 'Haveli', 'Maval', 'Mulshi', 'Baramati', 'Indapur', 'Daund', 'Shirur', 'Junnar', 'Ambegaon', 'Khed', 'Bhor', 'Velhe', 'Purandar'],
    Nashik: ['Nashik', 'Dindori', 'Igatpuri', 'Sinnar', 'Niphad', 'Yeola', 'Malegaon', 'Kalwan', 'Deola', 'Surgana', 'Trimbakeshwar', 'Chandwad', 'Satana', 'Baglan']
  };

  let taluka = extracted.taluka || '';
  // Fuzzy match taluka
  if (district && TALUKAS[district]) {
    const matchedTaluka = TALUKAS[district].find(t =>
      t.toLowerCase() === taluka.toLowerCase() ||
      t.toLowerCase().includes(taluka.toLowerCase()) ||
      taluka.toLowerCase().includes(t.toLowerCase())
    );
    if (matchedTaluka) taluka = matchedTaluka;
  }

  // Map irrigation source
  const irrigationMap = {
    'well': 'Borewell',
    'borewell': 'Borewell',
    'canal': 'Canal',
    'drip': 'Drip',
    'rain-fed': 'Rain-fed',
    'rainfed': 'Rain-fed',
    'rain fed': 'Rain-fed'
  };

  // Get primary crop entry
  const primaryCrop = extracted.cropEntries?.[0] || {};
  const irrigationRaw = (primaryCrop.irrigationSource || '').toLowerCase();
  const irrigation = irrigationMap[irrigationRaw] || primaryCrop.irrigationSource || '';

  // Map crop name to our list
  const cropMap = {
    'sugarcane': 'Sugarcane',
    'cotton': 'Cotton',
    'soybean': 'Soybean',
    'onion': 'Onion',
    'grapes': 'Grapes',
    'pomegranate': 'Pomegranate',
    'tomato': 'Tomato',
    'wheat': 'Wheat',
    'bajra': 'Bajra',
    'jowar': 'Jowar',
    'maize': 'Maize',
    'groundnut': 'Groundnut'
  };
  const cropRaw = (primaryCrop.cropName || '').toLowerCase();
  const previousCrop = cropMap[cropRaw] || primaryCrop.cropName || 'None';

  // Map season
  const seasonMap = {
    'kharif': 'Kharif',
    'rabi': 'Rabi',
    'summer': 'Summer'
  };
  const season = seasonMap[(primaryCrop.season || '').toLowerCase()] || primaryCrop.season || '';

  // Calculate area in acres
  let areaAcres = parseFloat(extracted.totalAreaAcres) || 0;
  if (!areaAcres && extracted.totalAreaHectare) {
    areaAcres = Math.round(parseFloat(extracted.totalAreaHectare) * 2.47 * 10) / 10;
  }
  areaAcres = areaAcres || 5; // Default

  // Build form data
  const formFields = {
    district,
    taluka,
    area: areaAcres,
    soilType: extracted.soilType || '',
    irrigationType: irrigation,
    previousCrop,
    season,
    landName: `${extracted.ownerName || 'My Land'} — ${extracted.village || ''} (${extracted.surveyNumber || 'N/A'})`
  };

  return {
    formFields,
    documentData: {
      ownerName: extracted.ownerName,
      village: extracted.village,
      surveyNumber: extracted.surveyNumber,
      subDivision: extracted.subDivision,
      khataNumber: extracted.khataNumber,
      totalAreaHectare: extracted.totalAreaHectare,
      assessmentValue: extracted.assessmentValue,
      occupantClass: extracted.occupantClass,
      otherRights: extracted.otherRights,
      cropEntries: extracted.cropEntries,
      confidence: extracted.confidence
    }
  };
}

module.exports = {
  extract712Document
};
