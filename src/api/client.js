const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * API client for sending PDFs to the letters API
 */
class ApiClient {
  constructor(apiConfig = config.api) {
    this.endpoint = apiConfig.endpoint;
    this.apiKey = apiConfig.key;
    
    // Set default axios instance with headers
    this.client = axios.create({
      headers: {
        'X-API-Key': this.apiKey
      },
    });
    
    logger.debug('API client initialized with endpoint: ' + this.endpoint);
  }
  
  /**
   * Upload a PDF file to the API
   * @param {string} pdfPath - Path to the PDF file
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} API response
   */
  async uploadPdf(pdfPath, options = {}) {
    try {
      // Check if file exists
      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found: ${pdfPath}`);
      }
      
      const form = new FormData();
      
      // Add PDF file
      form.append('pdfFile', fs.createReadStream(pdfPath));
      
      // Add options
      const defaultOptions = {
        extractAddress: false,
        formType: 'formB',
        isColorPrint: false,
        isDuplexPrint: true,
        description: path.basename(pdfPath),
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Add all options to form data
      Object.entries(mergedOptions).forEach(([key, value]) => {
        if (key !== 'pdfFile') {
          form.append(key, value.toString());
        }
      });
      
      logger.info(`Uploading PDF: ${path.basename(pdfPath)}`);
      logger.debug('Upload options:', mergedOptions);
      
      // Send request
      const response = await this.client.post(this.endpoint, form, {
        headers: {
          ...form.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      
      logger.info(`Upload successful. Letter ID: ${response.data?.data?.letter?.id || 'unknown'}`);
      return response.data;
      
    } catch (error) {
      logger.error('PDF upload failed:', error.message);
      
      if (error.response) {
        logger.debug('API Response:', error.response.data);
        return error.response.data;
      }
      
      throw error;
    }
  }
  
  /**
   * Get status of a letter
   * @param {string} letterId - ID of the letter
   * @returns {Promise<Object>} Letter status
   */
  async getLetterStatus(letterId) {
    try {
      logger.info(`Getting status for letter: ${letterId}`);
      
      const response = await this.client.get(`${this.endpoint}/${letterId}`);
      
      logger.info(`Letter status: ${response.data?.data?.status || 'unknown'}`);
      return response.data;
      
    } catch (error) {
      logger.error(`Failed to get letter status: ${error.message}`);
      
      if (error.response) {
        logger.debug('API Response:', error.response.data);
        return error.response.data;
      }
      
      throw error;
    }
  }
}

module.exports = ApiClient;