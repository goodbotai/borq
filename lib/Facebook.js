const winston = require('winston');
const Botkit = require('botkit');

const Config = require('../config/Config.js');

const karma = Botkit.facebookbot({
  logger: new winston.Logger({
    transports: [
      new (winston.transports.Console)({level: 'debug'}),
    ],
  }),
  debug: true,
  log: true,
  access_token: Config.facebookPageAccessToken,
  verify_token: Config.facebookVerifyToken,
  app_secret: Config.facebookAppSecret,
  receive_via_postback: true,
  validate_requests: true,
  stats_optout: true,
  require_delivery: true,
});

module.exports = {
  karma,
};
