const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const User = require('../models/User');
const { processNLP } = require('../services/nlp');

const extractText = async (filePath, mimeType) => {
  if (mimeType === 'application/pdf') {
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = false;

    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false });
    const pdfDoc = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map(item => item.str)
        .filter(str => str.trim().length > 0)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
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
    } catch (err) {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(422).json({
        message: 'Could not extract text. The file may be a scanned image PDF.',
        detail: err.message,
      });
    }

    const extractedText = normalizeText(rawText);

    if (extractedText.length < 100) {
      fs.unlinkSync(filePath);
      return res.status(422).json({
        message: 'Document appears to be empty or too short to analyse.',
      });
    }

    const { clauses, namedEntities, flaggedKeywords, topTerms } = processNLP(extractedText);

    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'txt';

    const document = await Document.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileType,
      extractedText,
      clauses,
      namedEntities,
      flaggedKeywords,
      topTerms,
      status: 'processing',
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { documentsCount: 1 } });

    fs.unlinkSync(filePath);

    res.status(201).json({
      documentId: document._id,
      fileName: document.fileName,
      fileType: document.fileType,
      characterCount: extractedText.length,
      clauseCount: clauses.length,
      flaggedKeywords,
      namedEntities,
      topTerms,
      textPreview: extractedText.substring(0, 300),
    });
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select('-extractedText');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .select('fileName fileType safetyScore status createdAt clauses flaggedKeywords')
      .sort({ createdAt: -1 })
      .lean();

    const response = documents.map((d) => ({
      _id: d._id,
      fileName: d.fileName,
      fileType: d.fileType,
      safetyScore: d.safetyScore,
      status: d.status,
      createdAt: d.createdAt,
      clauseCount: d.clauses?.length || 0,
      flaggedCount: d.flaggedKeywords?.length || 0,
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await User.findByIdAndUpdate(req.user._id, { $inc: { documentsCount: -1 } });

    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadDocument, getDocument, getHistory, deleteDocument };