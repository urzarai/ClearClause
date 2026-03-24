const fs = require('fs');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const User = require('../models/User');

const extractText = async (filePath, mimeType) => {
  if (mimeType === 'application/pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
  return fs.readFileSync(filePath, 'utf-8');
};

const normalizeText = (text) => {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\f/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const uploadDocument = async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let rawText;
    try {
      rawText = await extractText(filePath, req.file.mimetype);
    } catch {
      fs.unlinkSync(filePath);
      return res.status(422).json({ message: 'Could not extract text. The file may be a scanned image PDF.' });
    }

    const extractedText = normalizeText(rawText);

    if (extractedText.length < 100) {
      fs.unlinkSync(filePath);
      return res.status(422).json({ message: 'Document appears to be empty or too short to analyse.' });
    }

    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'txt';

    const document = await Document.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileType,
      extractedText,
      status: 'processing',
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { documentsCount: 1 } });

    fs.unlinkSync(filePath);

    res.status(201).json({
      documentId: document._id,
      fileName: document.fileName,
      fileType: document.fileType,
      characterCount: extractedText.length,
      textPreview: extractedText.substring(0, 300),
    });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadDocument };