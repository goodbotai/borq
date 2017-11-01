/** @module services */
const http = require('../lib/HTTP.js');
const ona = require('../lib/services/Ona.js');
const rapidpro = require('../lib/services/RapidPro.js');
const facebook = require('../lib/services/Facebook.js');


module.exports = {
  getFacebookProfile: facebook.getFacebookProfile,
  genAndPostSubmissionToOna: ona.genAndPostSubmissionToOna,
  getUser: rapidpro.getContact,
  updateUser: rapidpro.updateContact,
  createUser: rapidpro.createContact,
  deleteUser: rapidpro.deleteContact,
  getGroup: rapidpro.getGroup,
  sentry: http.sentry,
};
