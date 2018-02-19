/** @module services */
const Rapidpro = require('rapidpro-js');

const Logger = require('./Logger.js');
const Ona = require('../lib/services/Ona.js');

module.exports = {
  sentry: Logger.sentry,
  getGroup: Rapidpro.getGroup,
  getUser: Rapidpro.getContact,
  deleteUser: Rapidpro.deleteContact,
  updateUser: Rapidpro.updateContact,
  createUser: Rapidpro.createContact,
  genAndPostSubmissionToOna: Ona.genAndPostSubmissionToOna,
};
