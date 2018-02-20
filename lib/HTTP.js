/** @module http */
const fetch = require('node-fetch');

const Config = require('../config/Config.js');
const Logger = require('./Logger.js');

const defaultMaxRetries = /prod\w*/i.test(Config.environment) ? 3 : 0;
const defaultBackoff = 60000;

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
 * @param {string} url - URL the request was made to
 * @return {string/object} http response body. If no body the response object itself.
 */
function processResponse(response, payload, url) {
  const status = response.status;
  const logLevel = status < 400 ? 'info' : 'error';

  /**
   * log responses to console
   * @param {string} r - response text to log
   */
  function log(r) {
    Logger.log(logLevel, {
      Status: status,
      URL: url,
      Payload: payload,
      Response: r,
    });
  }

  if (response.body) {
    const body = extractResponseBody(response);
    Promise.resolve(body).then((JSONobj) => log(JSON.stringify(JSONobj)));
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
function request(
  url,
  {method, headers, body},
  rejectionText,
  maxRetries = defaultMaxRetries,
  backoff = defaultBackoff
) {
  return fetch(url, {method, headers, body})
    .then((response) => {
      if (response.status < 500) {
        return processResponse(response, body, url);
      } else {
        // 5xx retry
        if (maxRetries > 0) {
          // retry
          setTimeout(
            () =>
              request(
                url,
                {method, headers, body},
                rejectionText,
                maxRetries - 1,
                backoff * 2
              ),
            backoff
          );
        } else {
          return processResponse(response, body, url);
        }
      }
    })
    .catch((reason) => Logger.logRejectedPromise(rejectionText + reason));
}

module.exports = request;
