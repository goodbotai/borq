const env = process.env;

module.exports = {
  // core
  environment: env.NODE_ENV || 'development', // dev, prod, test
  PORT: env.PORT || env.APP_PORT || 3000, // env to run karma on
  defaultLanguage: env.DEFAULT_LANGUAGE || 'en',

  // milliseconds per min * number of mins
  conversationTimeout: env.CONVERSATION_TIMEOUT || (60000 * 20),

  // facebook
  facebookPageAccessToken: env.FACEBOOK_PAGE_ACCESS_TOKEN,
  facebookAppSecret: env.FACEBOOK_APP_SECRET,
  facebookApiVersion: env.FACEBOOK_API_VERSION || 'v2.10',
  facebookVerifyToken: env.FACEBOOK_VERIFY_TOKEN || 'karma',

  // external data stores
  onaOrg: env.ONA_USERNAME,
  onaFormIdString: env.ONA_FORM_ID_STRING,
  onaApiToken: env.ONA_API_TOKEN,
  rapidproApiToken: env.RAPIDPRO_API_TOKEN,
  rapidproGroups: env.RAPIDPRO_GROUPS ? JSON.parse(env.RAPIDPRO_GROUPS) : {},
  deletedUserGroups: env.DELETED_USER_RAPIDPRO_GROUPS ?
    JSON.parse(env.DELETED_USER_RAPIDPRO_GROUPS) :
    {},

  // logging and error reporting
  sentryDSN: env.SENTRY_DSN,
  karmaAccessLogFile: env.KARMA_ACCESS_LOG_FILE || 'bot.access.log',
  debugTranslations: env.DEBUG_TRANSLATIONS === 'true' || false,
};
