const chalk = require('chalk');
const moment = require('moment');
const config = require('../config');

// Log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Get configured log level
const configuredLevel = config.logging.level.toLowerCase();
const currentLevel = levels[configuredLevel] !== undefined ? levels[configuredLevel] : levels.info;

// Format timestamp
const timestamp = () => moment().format('YYYY-MM-DD HH:mm:ss');

// Create logger
const logger = {
  error: (message, ...args) => {
    if (currentLevel >= levels.error) {
      console.error(chalk.red(`[${timestamp()}] ERROR: ${message}`), ...args);
    }
  },
  warn: (message, ...args) => {
    if (currentLevel >= levels.warn) {
      console.warn(chalk.yellow(`[${timestamp()}] WARN: ${message}`), ...args);
    }
  },
  info: (message, ...args) => {
    if (currentLevel >= levels.info) {
      console.info(chalk.blue(`[${timestamp()}] INFO: ${message}`), ...args);
    }
  },
  debug: (message, ...args) => {
    if (currentLevel >= levels.debug) {
      console.debug(chalk.gray(`[${timestamp()}] DEBUG: ${message}`), ...args);
    }
  },
};

module.exports = logger;