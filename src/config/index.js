// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const fs = require('fs-extra');

// Create temp directory if it doesn't exist
const tempDir = process.env.TEMP_DIR || '/tmp/bbprinter';
fs.ensureDirSync(tempDir);

// Export configuration
const config = {
  api: {
    endpoint: process.env.API_ENDPOINT || 'http://localhost:3000/api/letters',
    key: process.env.API_KEY || '',
  },
  printer: {
    name: process.env.PRINTER_NAME || 'BriefButlerPrinter',
    description: process.env.PRINTER_DESCRIPTION || 'Virtual Printer for sending documents to web API',
  },
  pdf: {
    tempDir,
    keepCopies: process.env.KEEP_PDF_COPIES === 'true',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
};

// Validate required config
if (!config.api.key) {
  console.warn('Warning: API_KEY is not set in environment variables');
}

module.exports = config;