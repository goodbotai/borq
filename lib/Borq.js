const HTTP = require('./HTTP.js');
const Facebook = require('./Facebook.js');
const Services = require('./Services.js');
const Aggregate = require('./Aggregate.js');
const FacebookUtils = require('./FacebookUtils.js');
const Locales = require('./utils/Locales.js');
const Config = require('../config/Config.js');

module.exports = {
  aggregate: Aggregate,
  facebookBot: Facebook,
  facebookUtils: FacebookUtils,
  services: Services,
  http: HTTP,
  localeUtils: Locales,
  config: Config,
};
