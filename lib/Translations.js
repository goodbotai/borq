/** @module translations */
const Backend = require('i18next-node-fs-backend');
const winston = require('winston');
const i18next = require('i18next');
const fs = require('fs');

const config = require('../config/Config.js');

/**
* Generate namespaces needed by i18next from the files in the translations
* directory e.g ['en', 'in']
* @return {array} an array of strings that should be iso6391 language codes
*/
function generateNameSpaces() {
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
  ns: generateNameSpaces(),
  defaultNS: config.defaultLanguage,
  fallbackLng: config.defaultLanguage,
  backend: {loadPath: config.translationsDir + '/{{{ns}}}.json'},
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


/**
* Run a string through i18next.t function
* @param {string} key - Translations are objects and we specify the key needed
* to access the value
* @return {string} a translated language string
*/
function translate(key, interpolationObject) {
  return i18next.t(key, interpolationObject);
}

module.exports = translate;
