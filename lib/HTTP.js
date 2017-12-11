/** @module http */
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

  if (Config.sentryDSN) {
    return raven;
  }
  return null;
}

const sentry = Config.sentryDSN ?
      setupSentry(Config.sentryDSN, Config.environment, 'error') :
      undefined;

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
  const message = 'Promise rejected: ' + text;
  winston.log('error', message);
  if (Config.environment === 'production') {
    sentry.captureMessage(message);
  }
}

const defaultMaxRetries = /prod\w*/i.test(Config.environment) ? 3 : 0;
const defaultBackoff = 60000;
/**
* Generalize making http requests with node fetch
* retry failed requests with exponential backoff
* @param {string} url the request url
* @param {object} httpArguments
{
  method The HTTP method e.g POST or GET; default GET,
  headers HTTP request headers,
  body The request payload/HTTP request body
}
* @param {string} rejectionText
* @param {int} maxRetries Number of times to retry a failed request; default 3
* @param {Integer} backoff
* @return {object} parsed JSON response as a JS object
*/
function request(url,
                 {method, headers, body},
                 rejectionText,
                 maxRetries = defaultMaxRetries,
                 backoff = defaultBackoff) {
  return fetch(url, {method, headers, body})
    .then((response) => {
      const jsonResponse = extractJsonFromResponse(response);
      if (response.status < 300) {
        jsonResponse.then((json) => {
          const jsonString = JSON.stringify(json);
          winston.log('info',
                      `{Status: ${response.status}} ` +
                      `{Response: ${jsonString}}`);
        })
          .catch((reason) =>
                 genericCatchRejectedPromise('Extract JSON from response' +
                                             reason));
        return jsonResponse;
      } else {
        if (maxRetries > 0) {
          setTimeout(() => request(url,
                                   {method, headers, body},
                                   rejectionText,
                                   (maxRetries-1),
                                   (backoff*2)),
                     backoff);
        } else {
          jsonResponse.then((json) => {
            const jsonResponseString = JSON.stringify(json);
            winston.log('error',
                        `{Status: ${response.status}}` +
                        ` {URL: ${url}}` +
                        ` {Payload: ${body}}` +
                        ` {Response: ${jsonResponseString}}`);
            if (Config.environment === 'production') {
              sentry.captureMessage(`${rejectionText} failed\n` +
                                    `{Status: ${response.status}}\n` +
                                    `{URL: ${url}}\n` +
                                    `{Payload: ${body}}\n` +
                                    `{Response: ${jsonResponseString}}`);
            }
})
            .catch((reason) =>
                   genericCatchRejectedPromise(
                     'Extract JSON from response' + reason));
          }
}
})
    .catch((reason) => genericCatchRejectedPromise(rejectionText + reason));
}

module.exports = {request,
                  sentry,
                  genericCatchRejectedPromise};
