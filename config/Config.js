/** @module config */
const env = process.env;

/**
 * Configuration options for the bot
 * @constant
 * @type {object}
 */
module.exports = {
  // core
  environment: env.NODE_ENV || 'development', // dev, prod, test
  PORT: env.PORT || env.APP_PORT || 3000, // env to run karma on
  defaultLanguage: env.DEFAULT_LANGUAGE || 'en',
  translationsDir: env.TRANSLATIONS_DIR || './translations',
  debug: env.DEBUG || false,

  // milliseconds per min * number of mins
  conversationTimeout: env.CONVERSATION_TIMEOUT || 60000 * 20,

  // facebook
  facebookPageAccessToken: env.FACEBOOK_PAGE_ACCESS_TOKEN,
  facebookAppSecret: env.FACEBOOK_APP_SECRET,
  facebookApiVersion: env.FACEBOOK_API_VERSION || 'v2.10',
  facebookVerifyToken: env.FACEBOOK_VERIFY_TOKEN || 'borq',
  facebookApiHost:
    env.FACEBOOK_API_HOST || /test\w*/i.test(env.NODE_ENV)
      ? 'http://256.256.256.256'
      : undefined,

  // external data stores
  onaOrg: env.ONA_USERNAME,
  onaFormIds: env.ONA_FORM_IDS ? JSON.parse(env.ONA_FORM_IDS) : {},
  onaApiToken: env.ONA_API_TOKEN,
  rapidproApiToken: env.RAPIDPRO_API_TOKEN,
  rapidproGroups: env.RAPIDPRO_GROUPS ? JSON.parse(env.RAPIDPRO_GROUPS) : {},
  deletedUserGroups: env.DELETED_USER_RAPIDPRO_GROUPS
    ? JSON.parse(env.DELETED_USER_RAPIDPRO_GROUPS)
    : {},

  // logging and error reporting
  sentryDSN: env.SENTRY_DSN,
  hostname: env.HOSTNAME || 'borq',
  facility: env.FACILITY || 'localhost',
  graylogHost: env.GRAYLOG_HOST,
  graylogPort: env.GRAYLOG_PORT,
  karmaAccessLogFile: env.KARMA_ACCESS_LOG_FILE || 'bot.access.log',
  debugTranslations: env.DEBUG_TRANSLATIONS === 'true' || false,
};
