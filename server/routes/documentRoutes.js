const express = require('express');
const router = express.Router();
const { uploadDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('document'), uploadDocument);

module.exports = router;