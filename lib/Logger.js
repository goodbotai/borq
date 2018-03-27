/** @module logger */
const raven = require('raven');
const winston = require('winston');

const Config = require('../config/Config.js');

const logger = new winston.Logger();

if (/dev\w*/i.test(Config.environment)) {
  logger.add(winston.transports.Console, {
    timestamp: true,
    stringify: true,
    colorize: true,
  });
}

// if not dev or test so e.g prod, staging, canary etc
if (!/dev\w*|test\w*/i.test(Config.environment)) {
  logger.add(winston.transports.Console, {
    timestamp: true,
    json: true,
  });
  logger.add(require('winston-graylog2'), {
    name: 'Graylog',
    prelog: JSON.stringify,
    staticMeta: {environment: Config.environment},
    graylog: {
      servers: [{host: Config.graylogHost, port: Config.graylogPort}],
      hostname: Config.hostname,
      facility: Config.facility,
    },
  });
}

/**
 * A wrapper around logger.log because we can't export log on it's own
 * meant to be used as borq.log
 * @param {string} logLevel - The logLevel like error, warn etc.
 * @param {string} message - message of log, this could also just be a JSON object holding the message & metadata
 * @param {object} metadata - metadata for the log if the previous argument (message) is an object there's no need for this argment.
 */
function log(logLevel, message, metadata) {
  const level = message ? logLevel : 'info';
  const msg = message.message || '';

  if (typeof message === 'object' && !metadata) {
    logger.log(level, msg);
  } else if (typeof message === 'object' && metadata) {
    logger.log(level, msg, metadata);
  } else if (typeof message === 'string' && !metadata) {
    logger.log(level, message);
  } else {
    logger.log(level, message, metadata);
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
  log('error', {
    type: 'Promise rejected',
    text,
  });
  if (Config.environment === 'production') {
    sentry.captureMessage(text);
  }
}

module.exports = {
  log,
  sentry,
  logRejectedPromise,
};
