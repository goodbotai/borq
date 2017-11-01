/** @module services.rapidpro */
const winston = require('winston');

const http = require('../../lib/HTTP.js');
const utils = require('../utils/Utils.js');
const config = require('../../config/Config.js');

const rapidProBaseURL = 'https://rapidpro.ona.io/api/v2/';
const contactsEndPoint = `${rapidProBaseURL}contacts.json`;
const groupsEndPoint = `${rapidProBaseURL}groups.json`;

/**
* Create a user
* Default language config.defaultLanguage
* @param {array} urns - Array of URNs you want associated with the contact
* e.g ["tel:+250788123123", "twitter:ben", "facebook:123456789098"]
* @param {array} groups - Array of rapidpro contact groups to add a user to
* @param {string} language - An ISO6392 language code string
* @param {object} profile - The user profile object from facebook
* @param {object} extraFields - other fields to add to the rapidpro contact
* @param {string} baseURL - set the base URL. Mainly for testing.
* @return {Promise} - A promise with the newly created rapidpro contact
*/
function createContact(urns,
                       groups,
                       language,
                       profile,
                       extraFields,
                       baseURL = contactsEndPoint) {
  const contact = genContact(urns, groups, language, extraFields, profile);
  return postRapidPro(contact, baseURL);
}

/**
* Make a POST request to update a user's rapidpro contact.
* @param {object} user {urn, uuid} a urn or uuid used to identify the user.
* uuid takes precendence
* @param {object} payload the key value pair(s) to update in the contact.
* @param {string} baseURL - set the base URL. Mainly for testing.
* @return {promise} a promise for a rapidpro contact
*/
function updateContact({uuid, urn}, payload, baseURL = contactsEndPoint ) {
  const queryParam = uuid ? `uuid=${uuid}` : `urn=${urn}`;
  return postRapidPro(payload, `${baseURL}?${queryParam}`);
}

/**
* Implement soft user deletion by removing them from the current group
* and moving them to another group.
* @param {Integer} messengerId - Messenger PSID
* @param {Array} groups - array of UUIDs of group(s) to move the contact to
* @param {string} url - set the RapiPro URL. Mainly for testing.
* @return {Promise} - A promise with the moved rapidpro contact
*/
function deleteContact(messengerId,
                       groups,
                       url = contactsEndPoint ) {
  return postRapidPro({groups}, `${url}?urn=facebook:${messengerId}`)
    .then(({uuid, groups}) => {
      winston.log('info', `Deleted user ${messengerId} ` +
                  ` group(s) ${JSON.stringify(groups)}.`);
    })
    .catch((reason) =>
           http.genericCatchRejectedPromise(
             `Failed to postRapidProContact in deleteContact: ${reason}`));
}

/**
* Make a GET request to fetch a user's rapidpro contact.
* @param {object} user {urn, uuid} a urn or uuid used to GET the user.
* uuid takes precendence
* @param {string} baseURL - change the base URL for testing
* @return {promise} a promise for a rapidpro contact
* when a urn is used the response object has the following structure
* {... results: [contactObject]}
*/
function getContact({uuid, urn}, baseURL = rapidProBaseURL) {
  const queryParam = uuid ? `uuid=${uuid}` : `urn=${urn}`;
    return getRapidPro( `${baseURL}?${queryParam}`);
}

/**
* Generate an object that would make a valid rapidpro contact.
* @param {array} urns - Array of URNs you want associated with the contact
* e.g ["tel:+250788123123", "twitter:ben", "facebook:123456789098"]
* @param {array} groups a list of rapidpro groups to add the contact
* @param {string} language The preferred language of the contact
* @param {object} extraFields Extra fields not in the FB profile that you want
 in the rapidpro contact
* @param {object} facebook_profile a user's facebook profile
* @return {object} A valid rapidpro contact object
*/
function genContact(urns,
                    groups,
                    language,
                    extraFields,
                    {
                      first_name: firstName,
                      last_name: lastName,
                      profile_pic,
                      locale,
                      timezone,
                      gender,
                      is_payment_enabled,
                    }) {
  return {
    name: `${firstName} ${lastName}`,
    urns,
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

// Groups
/**
* @param {string} uuid - the uuid of the RapidPro group
* @param {string} baseURL - rapidpro url endpoint to get form
* @return {promise} a promise holding the request response
* For futher detail look at:
* [RapidPro groups documentation]{@link https://rapidpro.io/api/v2/groups}
*/
function getGroup(uuid, baseURL = groupsEndPoint) {
  return getRapidPro(`${baseURL}?uuid=${uuid}`);
}

// utils

/**
* Send a GET to rapidpro's contacts endpoint.
* We only need this function for its side effects therefore it lacks a
* return statemnt.
* @param {string} url - rapidpro url endpoint to get from
* @return {promise} a promise holding the request response
*/
function getRapidPro(url) {
  return http.request(
    url,
    {headers: {'Authorization': `Token ${config.rapidproApiToken}`}},
    'GET Rapidpro: ');
}

/**
* Send a POST to rapidpro's contacts endpoint.
* We only need this function for its side effects therefore it lacks a
* return statement.
* For futher detail look at:
* [RapidPro documentation]{@link https://rapidpro.io/api/v2/}
* @param {object} payload - This is the contact object to POST to rapidpro
* @param {string} rapidProBaseURL - rapidpro url endpoint to post to
* @return {promise} a promise holding the request response
*/
function postRapidPro(payload, rapidProBaseURL) {
  return http.request(rapidProBaseURL,
                      {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                          'Authorization': `Token ${config.rapidproApiToken}`,
                          'Content-Type': 'application/json',
                        },
                      },
                      'POST Contact to Rapidpro: ');
}

module.exports = {
  getContact,
  updateContact,
  createContact,
  deleteContact,
  getGroup,
};
