const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Upload = require('../models/Uploads.js');
const authenticateUser = require('../middleware/auth.js');

// 💾 Multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.xls' || ext === '.xlsx') {
    cb(null, true);
  } else {
    cb(new Error('Only .xls and .xlsx files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.get('/:id/insights', authenticateUser, async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const file = await Upload.findById(req.params.id);

    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: 'File missing from disk' });
    }

    const workbook = XLSX.readFile(file.filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    const prompt = `
      You are a professional data analyst. Analyze the following dataset and provide insights **strictly in raw markdown**.

      Requirements:
      - Use only GitHub-style markdown syntax (e.g., ## for headers, ** for bold).
      - Do NOT include any HTML tags or formatting.
      - Avoid phrases like "Here's your analysis".
      - Don't explain what you're doing, just give the analysis directly.

      Sections to include:
      1. High-level Summary
      2. Trends, Patterns, or Correlations
      3. Anomalies or Outliers
      4. Business Questions or Recommendations

      CSV data:
      ---
      ${csvData}
      ---
    `;


    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apikey = process.env.GEMINI_API_KEY;
    if (!apikey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`;
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.json();
      console.error("Gemini API Error:", errorBody);
      return res.status(500).json({ error: 'Failed to get insights from AI service.' });
    }

    const result = await geminiResponse.json();;
    const insightsText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights generated';

    if (!insightsText) {
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }

    res.json({ insights: insightsText });

  } catch (err) {
    console.error("Error in /insights route:", err);
    res.status(500).json({ error: 'Failed to generate AI insights.' });
  }
})

router.get('/stats/:id', authenticateUser, async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);

    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    // Check if file exists
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: 'File missing from disk' });
    }

    // Parse Excel file
    const workbook = XLSX.readFile(file.filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({
      originalName: file.originalName,
      uploadDate: file.uploadDate,
      storedFilename: file.storedFilename,
      chartPreferences: file.chartPreferences || {},
      parsedData: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load file stats' });
  }
});

router.get('/', authenticateUser, async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({ uploadDate: -1 });
    const uploadsWithData = await Promise.all(
      uploads.map(async (file) => {
        let parsedData = [];

        try {
          if (fs.existsSync(file.filePath)) {
            const workbook = XLSX.readFile(file.filePath);
            const sheetName = workbook.SheetNames[0];
            parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          }
        } catch (e) {
          console.error(`Error reading file ${file.filePath}`, e);
        }

        return {
          _id: file._id,
          userId: file.userId,
          originalName: file.originalName,
          storedFilename: file.storedFilename,
          filePath: file.filePath,
          uploadDate: file.uploadDate,
          chartPreferences: file.chartPreferences,
          parsedData,
        };
      })
    );

    res.json(uploadsWithData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch uploads' });
  }
});


// 📤 Upload route
router.post('/', authenticateUser, upload.single('excel'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 📝 Save metadata to MongoDB
    await Upload.create({
      userId: req.user.id, // comes from JWT middleware
      originalName: req.file.originalname,
      storedFilename: req.file.filename,
      filePath: req.file.path,
    });

    res.json({
      message: 'File uploaded, saved, and parsed successfully',
      filename: req.file.filename,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload or parse file' });
  }
});


router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath);
});

router.patch('/:id/preferences', authenticateUser, async (req, res) => {
  const { xAxis, yAxis, chartType } = req.body;

  try {
    const file = await Upload.findById(req.params.id);
    file.chartPreferences = { xAxis, yAxis, chartType };
    await file.save();

    res.json({ message: 'Chart preferences saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    // Delete file from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete from DB
    await Upload.deleteOne({ _id: req.params.id });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
