/** @module services */
const Logger = require('./Logger.js');
const Ona = require('../lib/services/Ona.js');
const Rapidpro = require('../lib/services/RapidPro.js');
const Facebook = require('../lib/services/Facebook.js');

module.exports = {
  sentry: Logger.sentry,
  getGroup: Rapidpro.getGroup,
  getUser: Rapidpro.getContact,
  deleteUser: Rapidpro.deleteContact,
  updateUser: Rapidpro.updateContact,
  createUser: Rapidpro.createContact,
  getFacebookProfile: Facebook.getFacebookProfile,
  genAndPostSubmissionToOna: Ona.genAndPostSubmissionToOna,
};
