/** @module facebook */
const winston = require('winston');
const Botkit = require('botkit');
const expressWinston = require('express-winston');

const Config = require('../config/Config.js');
const Services = require('./Services.js');

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
function setGreeting(greeting) {
  borqBot.api.messenger_profile.greeting(greeting);
}

function setGetStarted(getStartedText) {
  borqBot.api.messenger_profile.get_started(getStartedText);
}

function setMenu(menu) {
  borqBot.api.messenger_profile.menu(menu);
}

function start(bot, cb) {
  borqBot.setupWebserver(Config.PORT, (err, webserver) => {
    if (Config.sentryDSN) {
      webserver.use(Services.sentry.requestHandler());
    }

    webserver.use(expressWinston.logger({
      transports: [
        new winston.transports.File({
          filename: Config.karmaAccessLogFile,
          logstash: true,
          zippedArchive: true,
        })],
    }));

    cb(err, webserver);

    borqBot.createWebhookEndpoints(webserver, bot, () => {
      winston.log('Your borq bot is online');
    });

    if (Config.sentryDSN) {
      webserver.use(Services.sentry.errorHandler());
    }
  });
}

module.exports = {
  borqBot,
  setGetStarted,
  setGreeting,
  setMenu,
  start,
};
