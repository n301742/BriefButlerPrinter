#!/usr/bin/env node

// Simple test script to verify API connection

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Configuration
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3000/api/letters';
const API_KEY = process.env.API_KEY || '';

// Check if we have a sample PDF
const samplePdfPath = path.join(__dirname, 'sample.pdf');

// Create a sample PDF if one doesn't exist
async function createSamplePdf() {
  if (fs.existsSync(samplePdfPath)) {
    console.log('Using existing sample.pdf');
    return samplePdfPath;
  }
  
  console.log('Creating sample PDF...');
  
  try {
    // Try to use PDFKit if available
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(samplePdfPath);
    
    doc.pipe(writeStream);
    
    doc.fontSize(25).text('BriefButlerPrinter Test Document', 100, 100);
    doc.fontSize(12).text('This is a test document created to verify API connectivity.', 100, 150);
    doc.fontSize(12).text(`Date: ${new Date().toLocaleString()}`, 100, 180);
    
    doc.end();
    
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log('Sample PDF created successfully');
        resolve(samplePdfPath);
      });
      writeStream.on('error', reject);
    });
  } catch (error) {
    console.error('Failed to create sample PDF:', error.message);
    console.error('Please create a sample.pdf file manually for testing');
    process.exit(1);
  }
}

// Test the API connection
async function testApiConnection(pdfPath) {
  console.log(`Testing connection to API: ${API_ENDPOINT}`);
  
  // Check if API key is set
  if (!API_KEY) {
    console.warn('Warning: API_KEY is not set in .env file');
  }
  
  try {
    // Create form data
    const form = new FormData();
    form.append('pdfFile', fs.createReadStream(pdfPath));
    form.append('description', 'API Test Document');
    form.append('extractAddress', 'false');
    form.append('isColorPrint', 'false');
    form.append('isDuplexPrint', 'true');
    
    // Make the request
    console.log('Sending test document to API...');
    
    const response = await axios.post(API_ENDPOINT, form, {
      headers: {
        'X-API-Key': API_KEY,
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    
    console.log('\n✅ API connection successful!');
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('\n❌ API connection failed!');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

// Main function
async function main() {
  console.log('=== BriefButlerPrinter API Connection Test ===\n');
  
  try {
    // Create or use existing sample PDF
    const pdfPath = await createSamplePdf();
    
    // Test API connection
    const success = await testApiConnection(pdfPath);
    
    console.log('\n=== Test Complete ===');
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();