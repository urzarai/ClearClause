const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocument,
  getHistory,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('document'), uploadDocument);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;