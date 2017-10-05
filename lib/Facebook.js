/** @module facebook */
const winston = require('winston');
const Botkit = require('botkit');

const Config = require('../config/Config.js');

const borqBot = Botkit.facebookbot({
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

/**
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
* Create a messenger profile API so that your bot seems more human.
*/
function setGreeting (greeting) {
  borqBot.api.messenger_profile.greeting(greeting);
}

function setGetStarted (getStartedText) {
  borqBot.api.messenger_profile.get_started(getStartedText);
}

function setMenu (menu) {
  borqBot.api.messenger_profile.menu(menu);
}

module.exports = {
  borqBot,
  setGetStarted,
  setGreeting,
  setMenu
};
