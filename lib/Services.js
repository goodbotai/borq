const raven = require('raven');
const winston = require('winston');
const fetch = require('node-fetch');
const uuidV4 = require('uuid/v4');
const uuid = uuidV4();

const Config = require('../config/Config.js');
const aggregate = require('../lib/Aggregate.js');

const rapidproURL = 'https://rapidpro.ona.io/api/v2/contacts.json';
const onaSubmissionEndpointURL = `https://api.ona.io/${Config.onaOrg}/submission`;

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
* Make a GET request to fetch a user's rapidpro contact.
* @param {string} contactUUID the uuid used to identify a user on rapidpro
* @return {promise} holding a rapidpro contact
*/
function getRapidProContact(contactUUID) {
  const url = `https://rapidpro.ona.io/api/v2/contacts.json?uuid=${contactUUID}`;
  return fetch(url, {
    headers: {
      'Authorization': `Token ${Config.rapidproApiToken}`,
    },
  }).then(extractJsonFromResponse);
}

/**
* Get the facebook profile from facebook
* @param {string} fbMessengerId facebook messenger ID
* @return {promise} facebook profile consisting:
* first_name, last_name, profile_pic, locale, timezone, gender
* is_payment_enabled, last_ad_referral
*/
function getFacebookProfile(fbMessengerId) {
  const url = `https://graph.facebook.com/${Config.facebookApiVersion}/${fbMessengerId}` +
          '?fields=first_name,last_name,profile_pic,locale,timezone,gender' +
          ',is_payment_enabled,last_ad_referral' +
          `&access_token=${Config.facebookPageAccessToken}`;
  return fetch(url).then(extractJsonFromResponse);
}

/**
  * Send a POST to rapidpro's contacts endpoint.
  * We only need this function for its side effects therefore it lacks a
  * return statemnt.
  * @param {object} payload this is the contact object to POST to rapidpro
  * @param {Integer} messengerId Facebook Messenger User ID
  */
function postContactToRapidpro(payload, messengerId) {
    const jsonPayload = JSON.stringify(payload);
    fetch(`${rapidproURL}?urn=facebook:${messengerId}`,
      {method: 'POST',
        body: jsonPayload,
        headers: {
          'Authorization': `Token ${Config.rapidproApiToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status < 300) {
          // should we add these to access logs?
          winston.log('info', `${response.status} ${jsonPayload}`);
        } else {
          extractJsonFromResponse(response).then((jsonResponse) => {
            const jsonResponseString = JSON.stringify(jsonResponse);
            winston.log('error',
                        `{Status: ${response.status}}` +
                        ` {Payload: ${jsonPayload}}` +
                        ` {Response ${jsonResponseString}}`);
            if (Config.environment === 'production') {
              sentry.captureMessage('RapidPro contact update failed\n' +
                                    `{Status: ${response.status}}\n` +
                                    `{Payload: ${jsonPayload}}\n` +
                                    `{Response: ${jsonResponseString}}`);
            }
          });
        }
      });
  }

/**
  * Generate an object that would make a valid rapidpro contact.
  * @param {array} groups a list of rapidpro groups to add the contact
  * @param {string} language The preferred language of the contact
  * @param {object} extraFields Extra fields not in the FB profile that you want
    in the rapidpro contact
  * @param {object} facebook_profile a user's facebook profile
  * @return {object} A valid rapidpro contact object
  */
function genRapidproContact(groups,
                            language,
                            extraFields,
                            {first_name: firstName,
                             last_name: lastName,
                             profile_pic,
                             locale,
                             timezone,
                             gender,
                             is_payment_enabled}) {
  const contact = {
    name: `${firstName} ${lastName}`,
    language,
    groups,
    fields: {...extraFields,
             ...{
               profile_pic,
               locale,
               timezone,
               gender,
               is_payment_enabled,
             }},
  };
  return contact;
}

/**
  * Get the user facebook profile, generate a rapidpro contact and POST it
  * to rapidpro.
  * We only need this function for its side effects therefore it lacks a
  * return statemnt.
  * @param {array} groups a list of an array of rapidpro groups
  * @param {string} language preferred language of the rapidpro contact
  * @param {Integer} messengerId facebook messenger ID
  * @param {object} extraFields Extra fields not in the FB profile that you want
    in the rapidpro contact
  */
function genAndPostRapidproContact(groups, language, messengerId, extraFields) {
    getFacebookProfile(messengerId)
    .then((facebookProfile) => {
      const contact = genRapidproContact(groups,
                                         language,
                                         extraFields,
                                         facebookProfile);
      postContactToRapidpro(contact, messengerId);
    });
}


  /**
  * send a POST to Ona's submission endpoint.
  * We only need this function for its side effects therefore it lacks a
  * return statemnt.
  * @param {object} payload
  */
  function postSubmissionToOna(payload) {
    const jsonPayload = JSON.stringify(payload);
    fetch(onaSubmissionEndpointURL,
      {
        method: 'POST',
        body: jsonPayload,
        headers: {
          'Authorization': `Token ${Config.onaApiToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status < 300) {
          winston.log('info',
                      `{Status: ${response.status}} {Data ${jsonPayload}}`);
        } else {
          extractJsonFromResponse(response).then((jsonResponse) => {
            const jsonResponseString = JSON.stringify(jsonResponse);
            winston.log('error',
                        `{Status: ${response.status}}` +
                        ` {Payload: ${jsonPayload}}` +
                        ` {Response ${jsonResponseString}}`);
            if (Config.environment === 'production') {
              sentry.captureMessage('Ona submission failed\n' +
                                    `{Status: ${response.status}}\n` +
                                    `{Payload: ${jsonPayload}}\n` +
                                    `{Response ${jsonResponseString}}`);
            }
          });
        }
      });
  }

/**
  * Generate an ona submission from a completed conversation
  * @param {object} conversation the conversation with the bot
  * @return {object} a valid Ona submission object
*/
function genOnaSubmission(conversation) {
  const submission = {};
  submission.id = Config.onaFormIdString;
  const responses = conversation.submission_metadata.responses;
  const names = Object.keys(responses);

  const subb = names.map((name) => {
    const kv = {};
    if (name === 'repeat') {
      kv.spoken = responses.repeat.spoken;
      kv.with_whom = responses.repeat.with_whom;
      return kv;
    }
    kv[name] = responses[name].text;
    return kv;
  });

  const sub = subb.reduce((x = {}, kv) => Object.assign(x, kv));
  submission.submission = sub;
  submission.submission.meta = {instanceID: `uuid:${uuid}`};
  return submission;
}

/**
  * Generate a submission and POST it to Ona
  * We only need this function for its side effects therefore it lacks a
  * return statemnt.
  * @param {object} convo A conversation object generated by botkit.
*/
function genAndPostSubmissionToOna(convo) {
  const aggregatedConvo = aggregate(convo);
  const messengerId = aggregatedConvo.userId;
  const submission = genOnaSubmission(aggregatedConvo);
  getFacebookProfile(Config.facebookApiVersion,
                     messengerId,
                     Config.facebookPageAccessToken)
    .then(({first_name: firstName, last_name: lastName}) => {
      submission.submission.first_name = firstName;
      submission.submission.last_name = lastName;
      submission.submission.messenger_id = messengerId;

      postSubmissionToOna(submission);
    });
}

module.exports = {getFacebookProfile,
                  getRapidProContact,
                  genAndPostRapidproContact,
                  genAndPostSubmissionToOna,
                  sentry};
