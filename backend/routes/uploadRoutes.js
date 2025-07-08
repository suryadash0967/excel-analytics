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
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load file stats' });
  }
});

router.get('/', authenticateUser, async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({ uploadDate: -1 });
    res.json(uploads);
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

module.exports = router;
