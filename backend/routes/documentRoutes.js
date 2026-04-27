// ─── Document Routes ─────────────────────────────────────────────
// Handles 7/12 document upload and data extraction

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extract712Document } = require('../services/documentService');

// Configure multer for memory storage (no disk write)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  }
});

/**
 * POST /api/document/extract-712
 * Upload a 7/12 document image and extract structured data
 * 
 * Accepts: multipart/form-data with field "document" (image file)
 *      OR: JSON body with "image" (base64 encoded image string)
 */
router.post('/extract-712', upload.single('document'), async (req, res) => {
  try {
    let base64Image, mimeType;

    if (req.file) {
      // Multipart file upload
      base64Image = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype;
    } else if (req.body.image) {
      // Base64 JSON upload
      base64Image = req.body.image;
      mimeType = req.body.mimeType || 'image/jpeg';
    } else {
      return res.status(400).json({
        error: 'No document provided. Upload an image file (field: "document") or send base64 in body (field: "image").'
      });
    }

    console.log(`📄 Extracting 7/12 document (${mimeType}, ${Math.round(base64Image.length / 1024)}KB)...`);

    const result = await extract712Document(base64Image, mimeType);

    console.log(`✅ Extraction complete — District: ${result.formFields.district}, Taluka: ${result.formFields.taluka}, Area: ${result.formFields.area} acres`);

    res.json({
      success: true,
      ...result
    });

  } catch (err) {
    console.error('Document extraction failed:', err.message);
    res.status(500).json({
      success: false,
      error: `Document extraction failed: ${err.message}`,
      hint: 'Make sure the image is clear and contains a valid Maharashtra 7/12 document.'
    });
  }
});

module.exports = router;
