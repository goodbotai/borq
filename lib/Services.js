const winston = require('winston');
const fetch = require('node-fetch');
const uuidV4 = require('uuid/v4');
const uuid = uuidV4();

const Config = require('../config/Config.js');
const aggregate = require('../lib/Aggregate.js');
const http = require('../lib/HTTP.js');

const rapidproURL = 'https://rapidpro.ona.io/api/v2/contacts.json';
const onaSubmissionEndpointURL = `https://api.ona.io/${Config.onaOrg}/submission`;

/**
* Make a GET request to fetch a user's rapidpro contact.
* @param {string} contactUUID the uuid used to identify a user on rapidpro
* @return {promise} holding a rapidpro contact
*/
function getRapidProContact(contactUUID) {
  http.request(`https://rapidpro.ona.io/api/v2/contacts.json?uuid=${contactUUID}`,
               {headers: {'Authorization': `Token ${Config.rapidproApiToken}`}},
               'GET Rapidpro contact: ');}

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
* Send a POST to rapidpro's contacts endpoint.
* We only need this function for its side effects therefore it lacks a
* return statemnt.
* @param {object} payload this is the contact object to POST to rapidpro
* @param {Integer} messengerId Facebook Messenger User ID
*/
function postContactToRapidpro(payload, messengerId) {
  const body = JSON.stringify(payload);
  http.request(`${rapidproURL}?urn=facebook:${messengerId}`,
               {
                 method: 'POST',
                 body,
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
  const facebookProfile = getFacebookProfile(messengerId);
  const contact = genRapidproContact(groups,
                                         language,
                                         extraFields,
                                     facebookProfile);
  postContactToRapidpro(contact, messengerId);
}

/**
* send a POST to Ona's submission endpoint.
* We only need this function for its side effects therefore it lacks a
* return statemnt.
* @param {object} payload
*/
function postSubmissionToOna(payload) {
  const jsonPayload = JSON.stringify(payload);
  http.request(onaSubmissionEndpointURL,
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
*/
function genAndPostSubmissionToOna(convo) {
  const aggregatedConvo = aggregate(convo);
  const messengerId = aggregatedConvo.userId;
  const submission = genOnaSubmission(aggregatedConvo);
  const {
    first_name: firstName,
    last_name: lastName
  } = getFacebookProfile(messengerId);

  submission.submission.first_name = firstName;
  submission.submission.last_name = lastName;
  submission.submission.messenger_id = messengerId;
  postSubmissionToOna(submission);
}

module.exports = {getFacebookProfile,
                  getRapidProContact,
                  genAndPostRapidproContact,
                  genAndPostSubmissionToOna,
                  sentry: http.sentry};
