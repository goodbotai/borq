const fetch = require('node-fetch');
const raven = require('raven');
const winston = require('winston');

const Config = require('../config/Config.js');

/**
* Configure Sentry using the env vars pased if in production
* @param {string} sentryDSN The url given by Sentry tied to your account
* @param {string} environment dev, testing, peoduction etc.
* @param {string} loggingLevel error, info, warn etc.
* @return {object} return raven object if in production
*/
function setupSentry(sentryDSN, environment, loggingLevel) {
  raven.config(sentryDSN, {
    logger: loggingLevel,
    environment,
  }).install();

  if (Config.environment === 'production') {
    return raven;
  }
  return null;
}

const sentry = setupSentry(Config.sentryDSN, Config.environment, 'error');

/**
* Call json function in the response object
* @param {object} response a http response object
* @return {String} JSON string from the response object
*/
function extractJsonFromResponse(response) {
  return response.json();
}

/**
* A function to send rejected promise errors to both winston and sentry
* @param {string} text the promise rejection error text
*/
function genericCatchRejectedPromise(text) {
  let message = 'Promise rejected: ' + text;
  winston.log('error', message);
  if (Config.environment === 'production') {
    sentry.captureMessage(message);
  }
}

/**
* Generalize making http requests with node fetch
* retry failed requests with exponential backoff
* If all 3 retries fail report and log the error.
* @param {string} url the request url
* @param {string} method HTTP method e.g POST or GET Default GET
* @param {object} headers HTTP request headers
* @return {object} parsed JSON response as a JS object
*/
function request(url, {method, headers, body}, rejectionText){
  return fetch(url, {
    method,
    headers,
    body,
  }).then((response) => {
    const jsonResponse = extractJsonFromResponse(response);
    if (response.status < 300) {
      winston.log('info', `${response.status} ${body}`);
      return jsonResponse;
    } else {
      const jsonResponseString = JSON.stringify(jsonResponse);
      winston.log('error',
                  `{Status: ${response.status}}` +
                  ` {Payload: ${body}}` +
                  ` {Response ${jsonResponseString}}`);
      if (Config.environment === 'production') {
        sentry.captureMessage(`${rejectionText} failed\n` +
                              `{Status: ${response.status}}\n` +
                              `{Payload: ${body}}\n` +
                              `{Response: ${jsonResponseString}}`);
      }}})
    .catch((reason) => genericCatchRejectedPromise(rejectionText + reason));
}

module.exports = {request,
                  sentry};
