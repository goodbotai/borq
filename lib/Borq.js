/** @module borq */
const HTTP = require('./HTTP.js');
const Facebook = require('./Facebook.js');
const Services = require('./Services.js');
const Aggregate = require('./Aggregate.js');
const FacebookUtils = require('./FacebookUtils.js');
const Locales = require('./utils/Locales.js');
const Logger = require('./Logger.js');
const Config = require('../config/Config.js');
const Translations = require('./Translations.js');
const Conversations = require('./Conversations.js');

module.exports = {
  log: Logger.log,
  logger: Logger,
  aggregate: Aggregate,
  facebook: Facebook,
  facebookUtils: FacebookUtils,
  conversations: Conversations,
  services: Services,
  http: HTTP,
  localeUtils: Locales,
  config: Config,
  translate: Translations,
};
