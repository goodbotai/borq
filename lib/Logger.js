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
  logger.log('error', message);
  if (Config.environment === 'production') {
    sentry.captureMessage(message);
  }
}


module.exports = {
  log: logger,
  logRejectedPromise,
}
