const uuidV4 = require('uuid/v4');
const uuid = uuidV4();
const winston = require('winston');

const Config = require('../config/Config.js');
const aggregate = require('../lib/Aggregate.js');
const http = require('../lib/HTTP.js');
const utils = require('./utils/Utils.js');
const localeUtils = require('./utils/Locales.js');

const rapidproURL = 'https://rapidpro.ona.io/api/v2/contacts.json';
const onaSubmissionEndpointURL = `https://api.ona.io/${Config.onaOrg}/submission`;

/**
* Make a GET request to fetch a user's rapidpro contact.
* @param {object} user {urn, uuid} a urn or uuid used to GET the user.
* uuid takes precendence
* @return {promise} a promise for a rapidpro contact
* when a urn is used the response object has the following structure
* {... results: [contactObject]}
*/
function getRapidProContact({uuid, urn}) {
  const queryParam = uuid ? `uuid=${uuid}` : `urn=${urn}`;
  return http.request(
    `https://rapidpro.ona.io/api/v2/contacts.json?${queryParam}`,
    {headers: {'Authorization': `Token ${Config.rapidproApiToken}`}},
    'GET Rapidpro contact: ');
}

/**
* Make a POST request to update a user's rapidpro contact.
* @param {object} user {urn, uuid} a urn or uuid used to identify the user.
* uuid takes precendence
* @param {object} payload the key value pair(s) to update in the contact.
* @return {promise} a promise for a rapidpro contact
*/
function updateRapidProContact({uuid, urn}, payload) {
  const queryParam = uuid ? `uuid=${uuid}` : `urn=${urn}`;
  return http.request(
    `https://rapidpro.ona.io/api/v2/contacts.json?${queryParam}`,
    {method: 'POST',
     headers: {
       'Authorization': `Token ${Config.rapidproApiToken}`,
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(payload)},
    'Update Rapidpro contact: ');
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
  return http.request(url, {}, 'GET Facebook profile: ');
}

/**
* Create a user
* Default language Config.defaultLanguage
* @param {string} messengerId The messeger ID of the current user
* @param {string} referrer The rapidpro contact uuid of the user who sent them
* a link to the bot
* @return {promise} A promise with the newly created rapidpro contact
*/
function createUser(messengerId, referrer) {
  return getFacebookProfile(messengerId)
    .then((profile) => {
      const language =
            localeUtils.lookupISO6392(profile.locale || Config.defaultLanguage);
      return genAndPostRapidproContact(Config.rapidproGroups,
                                       language,
                                       messengerId,
                                       profile,
                                       {referrer});
    })
    .catch((reason) =>
           http.genericCatchRejectedPromise('Failed to fetch Facebook profile' +
                                            `in createUser: ${reason}`));
}

/**
* Implement soft user deletion by removing them from the current group
* and moving them to another group
* @param {Integer} messengerId user's facebook messenger id
* @param {Array} groups array of UUIDs of group(s) to move the contact to
*/
function deleteUser(messengerId, groups) {
  postContactToRapidpro({groups}, messengerId)
    .then(({uuid, groups}) => {
      winston.log('info', `Deleted user ${messengerId} to group(s) ${groups}.`);
    })
    .catch((reason) =>
           http.genericCatchRejectedPromise(
             `Failed to postRapidProContact in deleteUser: ${reason}`));
}

/**
* Send a POST to rapidpro's contacts endpoint.
* We only need this function for its side effects therefore it lacks a
* return statemnt.
* @param {object} payload this is the contact object to POST to rapidpro
* @param {Integer} messengerId Facebook Messenger User ID
* @return {promise} a promise holding the request response
*/
function postContactToRapidpro(payload, messengerId) {
  return http.request(`${rapidproURL}?urn=facebook:${messengerId}`,
                      {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                          'Authorization': `Token ${Config.rapidproApiToken}`,
                          'Content-Type': 'application/json',
                        },
                      },
                      'POST Contact to Rapidpro: ');
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
  return {
    name: `${firstName} ${lastName}`,
    language,
    groups,
    fields: utils.mergeObjects(extraFields,
                               {
                                 profile_pic,
                                 locale,
                                 timezone,
                                 gender,
                                 is_payment_enabled,
                               }),
  };
}

/**
* Get the user facebook profile, generate a rapidpro contact and POST it
* to rapidpro.
* We only need this function for its side effects therefore it lacks a
* return statemnt.
* @param {array} groups a list of an array of rapidpro groups
* @param {string} language preferred language of the rapidpro contact
* @param {Integer} messengerId facebook messenger ID
* @param {Object} facebookProfile Facebook profile of the user
* @param {object} extraFields Extra fields not in the FB profile that you want
 in the rapidpro contact
* @return {promise} a promise holding the request response
*/
function genAndPostRapidproContact(groups,
                                   language,
                                   messengerId,
                                   facebookProfile,
                                   extraFields) {
  return postContactToRapidpro(
    genRapidproContact(groups, language, extraFields, facebookProfile),
    messengerId);
}

/**
* send a POST to Ona's submission endpoint.
* We only need this function for its side effects therefore it lacks a
* return statemnt.
* @param {object} payload
* @return {promise} a promise holding the request response
*/
function postSubmissionToOna(payload) {
  return http.request(onaSubmissionEndpointURL,
                      {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                          'Authorization': `Token ${Config.onaApiToken}`,
                          'Content-Type': 'application/json',
                        },
                      },
                      'POST submission to Ona: ');
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
* @return {promise} a promise holding the request response
*/
function genAndPostSubmissionToOna(convo) {
  const aggregatedConvo = aggregate(convo);
  const messengerId = aggregatedConvo.userId;
  const submission = genOnaSubmission(aggregatedConvo);
  const {
    first_name: firstName,
    last_name: lastName,
  } = getFacebookProfile(messengerId);

  submission.submission.first_name = firstName;
  submission.submission.last_name = lastName;
  submission.submission.messenger_id = messengerId;
  return postSubmissionToOna(submission);
}

module.exports = {getFacebookProfile,
                  getRapidProContact,
                  genAndPostRapidproContact,
                  genAndPostSubmissionToOna,
                  updateRapidProContact,
                  createUser,
                  deleteUser,
                  sentry: http.sentry};
