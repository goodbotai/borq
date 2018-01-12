const raven = require('raven');
const winston = require('winston');

const Config = require('../config/Config.js');

const logger = new winston.Logger();

logger.add(winston.transports.Console, {
  timestamp: true,
  stringify: true,
  colorize: true,
});

/**
 * A wrapper around logger.log because we can't export log on it's own
 * meant to be used as borq.log
 * @param {string} logLevel - The logLevel like error, warn etc.
 * @param {string} message - the message to log
 */
function log(logLevel, message) {
  if (message === undefined) {
    logger.log(logLevel);
  } else {
    logger.log(logLevel, message);
  }
}

/**
 * Configure Sentry using the env vars pased if in production
 * @param {string} sentryDSN The url given by Sentry tied to your account
 * @param {string} environment dev, testing, peoduction etc.
 * @param {string} loggingLevel error, info, warn etc.
 * @return {object} return raven object if in production
 */
function setupSentry(sentryDSN, environment, loggingLevel) {
  raven
    .config(sentryDSN, {
      logger: loggingLevel,
      environment,
    })
    .install();

  if (Config.sentryDSN) {
    return raven;
  }
  return null;
}

const sentry = Config.sentryDSN
  ? setupSentry(Config.sentryDSN, Config.environment, 'error')
  : undefined;

/**
 * A function to send rejected promise errors to both winston and sentry
 * @param {string} text the promise rejection error text
 */
function logRejectedPromise(text) {
  const message = 'Promise rejected: ' + text;
  log('error', message);
  if (Config.environment === 'production') {
    sentry.captureMessage(message);
  }
}

module.exports = {
  log,
  sentry,
  logRejectedPromise,
};
