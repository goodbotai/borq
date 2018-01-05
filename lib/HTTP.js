/** @module http */
const fetch = require('node-fetch');
const raven = require('raven');
const winston = require('winston');

const Config = require('../config/Config.js');


const defaultMaxRetries = /prod\w*/i.test(Config.environment) ? 3 : 0;
const defaultBackoff = 60000;

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

/**
* Extract the response body from a response.
* Make to check that the response has a body before this.
* @param {object} response - HTTP response object
* @return {string} http response body
*/
function extractResponseBody(response) {
  const contentType = response.headers.get('content-type');
  if (/json/.test(contentType)) {
    return response.json();
  } else if (/text/.test(contentType)) {
    return response.text();
  } else {
    return response.body;
  }
}

/**
* @param {object} response - HTTP response object
* @param {string} payload -  body of the HTTP request
* @return {string/object} http response body. If no body the response object itself.
*/
function processResponse(response, payload) {
  const status = response.status;
  const server = response.headers.get('server');
  const logLevel = status < 400 ? 'info' : 'error';

  /**
  * log errors to console
  * @param {string} r - response text to log
  */
  function log(r) {
    winston.log(logLevel, `{
Status: ${status}
Server: ${server}
Payload: ${payload}
Response: ${r}
}`);
  }

  if (response.body) {
    const body = extractResponseBody(response);
    Promise.resolve(body).then((txt) => log(JSON.stringify(txt)));
    return body;
  } else {
    log('No response body');
    return response;
  }
}

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
* @return {object} http response object
*/
function request(url,
                 {method, headers, body},
                 rejectionText,
                 maxRetries = defaultMaxRetries,
                 backoff = defaultBackoff) {
  return fetch(url, {method, headers, body})
    .then((response) => {
      if (response.status < 500) {
        return processResponse(response, body);
      } else { // 5xx retry
        if (maxRetries > 0) { // retry
          setTimeout(() => request(url,
                                   {method, headers, body},
                                   rejectionText,
                                   (maxRetries-1),
                                   (backoff*2)),
                     backoff);
        } else {
          return processResponse(response, body);
        }
      }
    })
    .catch((reason) => genericCatchRejectedPromise(rejectionText + reason));
}

module.exports = {request,
                  sentry,
                  genericCatchRejectedPromise};
