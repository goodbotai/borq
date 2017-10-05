const config = require('../config/Config.js');
const localeUtils = require('./utils/Locales.js');
const winston = require('winston');
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const fs = require('fs');

function getNameSpaces() {
  const files = fs.readdirSync(config.translationsDir)
        .filter((path) => path.match(/\w*.json$/g));
  const f = files.map((file) => file.split('.')[0]);
  return f.map((path) => path
               .split('\/')
               .filter((char) => char !== '')
               .join('/'));
}

const i18nextOptions = {
  debug: config.debugTranslations,
  ns: getNameSpaces(),
  defaultNS: config.defaultLanguage,
  fallbackLng: config.defaultLanguage,
  backend: { loadPath: config.translationsDir + '/{{{ns}}}.json', },
  interpolation: {
    prefix: '{{{',
    suffix: '}}}',
  },
};

i18next
  .use(Backend)
  .init(i18nextOptions,
        (err, t) => {
          if (err) {
            winston.log('error', `Error loading translations: ${t}`, err);
          } else {
            winston.log('info', 'Translations loaded successfully');
          }
});

function translate (val) {
  return i18next.t(val);
}

module.exports = translate;
