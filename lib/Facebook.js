/** @module facebook */
const Botkit = require('botkit');

const Config = require('../config/Config.js');
const Logger = require('./Logger.js');

const controller = Botkit.facebookbot({
  log: true,
  stats_optout: true,
  debug: Config.debug,
  require_delivery: true,
  validate_requests: true,

  api_host: Config.facebookApiHost,
  app_secret: Config.facebookAppSecret,
  verify_token: Config.facebookVerifyToken,
  access_token: Config.facebookPageAccessToken,
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
 * Get the messenger user's facebook profile
 * @param {string} fbMessengerId facebook messenger ID
 * @return {promise} facebook profile consisting:
 * first_name, last_name, profile_pic, locale, timezone, gender
 * is_payment_enabled, last_ad_referral
 */
function getFacebookProfile(fbMessengerId) {
  return controller.api.user_profile(fbMessengerId);
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
      webserver.use(Logger.sentry.requestHandler());
    }

    cb(err, webserver);

    controller.createWebhookEndpoints(webserver, bot, () => {
      Logger.log('info', 'Your borq bot is online');
    });

    if (Config.sentryDSN) {
      webserver.use(Logger.sentry.errorHandler());
    }
  });
  controller.startTicking();
}

module.exports = {
  controller,
  setGetStarted,
  getFacebookProfile,
  setGreeting,
  setMenu,
  start,
};
