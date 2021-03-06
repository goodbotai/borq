/** @module translations */
const fs = require('fs');
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');

const config = require('../config/Config.js');
const Logger = require('./Logger.js');

/**
 * Generate namespaces needed by i18next from the files in the translations
 * directory e.g ['en', 'in']
 * @param {string} dir - Directory containing translation files
 * @return {array} an array of strings that should be iso6391 language codes
 */
function generateNameSpaces(dir) {
  const files = fs.readdirSync(dir).filter((path) => path.match(/\w*.json$/g));
  const f = files.map((file) => file.split('.')[0]);
  return f.map((path) =>
    path
      .split('/')
      .filter((char) => char !== '')
      .join('/')
  );
}

/**
 * Generate i18next translations
 * @return {function} a function with closure over i18next object
 */
function translateiUsing18next() {
  if (fs.existsSync(config.translationsDir)) {
    const i18nextOptions = {
      debug: config.debugTranslations,
      ns: generateNameSpaces(config.translationsDir),
      defaultNS: config.defaultLanguage,
      fallbackLng: config.defaultLanguage,
      backend: {loadPath: config.translationsDir + '/{{{ns}}}.json'},
      interpolation: {
        prefix: '{{{',
        suffix: '}}}',
      },
    };

    i18next.use(Backend).init(i18nextOptions, (err, t) => {
      if (err) {
        Logger.log('error', {
          message: `Error loading translations: ${t}`,
          error: err,
          dir: config.defaultLanguage,
          defaultLanguage: config.defaultLanguage,
        });
      } else {
        Logger.log('info', {
          message: 'Translations loaded successfully',
          dir: config.defaultLanguage,
          defaultLanguage: config.defaultLanguage,
        });
      }
    });
  } else {
    Logger.log('info', 'Not using translations');
  }

  /**
   * Run a string through i18next.t function
   * @param {string} key - Translations are objects and we specify the key needed
   * to access the value
   * @param {object} interpolationObject - Object holding interpolations
   * @return {string} a translated language string
   */
  function t(key, interpolationObject) {
    return i18next.t(key, interpolationObject);
  }

  return t;
}

const translate = translateiUsing18next();

module.exports = translate;
