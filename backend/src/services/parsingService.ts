import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';

/**
 * Parses a PDF buffer and extracts text.
 */
export const parsePDF = async (buffer: Buffer): Promise<string> => {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text.trim();
  } catch (error) {
    console.error('PDF Parse Error:', error);
    throw new Error('Failed to parse PDF document.');
  }
};

/**
 * Parses a DOCX buffer and extracts raw text.
 */
export const parseDOCX = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    throw new Error('Failed to parse DOCX document.');
  }
};

/**
 * Parses a TXT buffer and returns UTF-8 text.
 */
export const parseTXT = async (buffer: Buffer): Promise<string> => {
  try {
    return buffer.toString('utf-8').trim();
  } catch (error) {
    throw new Error('Failed to parse TXT document.');
  }
};
