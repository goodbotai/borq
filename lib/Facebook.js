/** @module facebook */
const winston = require('winston');
const Botkit = require('botkit');

const Config = require('../config/Config.js');
const Services = require('./Services.js');

const controller = Botkit.facebookbot({
  debug: true,
  log: true,
  access_token: Config.facebookPageAccessToken,
  verify_token: Config.facebookVerifyToken,
  app_secret: Config.facebookAppSecret,
  api_host: Config.facebookApiHost,
  validate_requests: true,
  stats_optout: true,
});

// Create a messenger profile API so that your bot seems more human.
// https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
/**
* Set greeting text for the bot.
* [Facebook docs on Greeting Text]{@link https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/greeting}
* @param {string} greeting - greeting text
*/
function setGreeting(greeting) {
  controller.api.messenger_profile.greeting(greeting);
}

/**
* Set the payload for the get started button.
* [Facebook docs on a Get Started Button ]{@link https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/get-started-button}
* @param {string} getStartedPayload - payload string
* button is clicked
*/
function setGetStarted(getStartedPayload) {
  controller.api.messenger_profile.get_started(getStartedPayload);
}

/**
* Set a facebook messenger persistent menu.
* [Facebook docs on a Persistent Menu]{@link https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu}
* @param {object} menu - menu object
*/
function setMenu(menu) {
  controller.api.messenger_profile.menu(menu);
}

/**
* Start an express webserver for the bot.
* @param {object} bot - A bot object created by botkit
* @param {function} cb - A callback function to define routes
* @example
const myBot = facebookBot.controller.spawn({});
facebookBot.start(myBot, (err, webserver) => {
  webserver.get('/', (req, res) => {
    res.send('<h3>This is a bot</h3>');
  });
  webserver.get('/other', (req, res) => {
    res.send('<h3>This is a bot at route /other</h3>');
  });
});
*/
function start(bot, cb) {
  controller.setupWebserver(Config.PORT, (err, webserver) => {
    if (Config.sentryDSN) {
      webserver.use(Services.sentry.requestHandler());
    }

    cb(err, webserver);

    controller.createWebhookEndpoints(webserver, bot, () => {
      winston.log('info', 'Your borq bot is online');
    });

    if (Config.sentryDSN) {
      webserver.use(Services.sentry.errorHandler());
    }
  });
  controller.startTicking();
}

module.exports = {
  controller,
  setGetStarted,
  setGreeting,
  setMenu,
  start,
};
