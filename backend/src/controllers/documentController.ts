import { Request, Response, NextFunction } from 'express';
import { parsePDF, parseDOCX, parseTXT } from '../services/parsingService.js';

export const parseDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const { mimetype, buffer } = file;
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      extractedText = await parsePDF(buffer);
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await parseDOCX(buffer);
    } else if (mimetype === 'text/plain') {
      extractedText = await parseTXT(buffer);
    } else {
      return res.status(400).json({ success: false, error: 'Unsupported file type.' });
    }

    return res.status(200).json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    next(error);
  }
};
