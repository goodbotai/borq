const Config = require('../config/Config.js');


/**
* Splits a locale into language and region but only returns language
* @param {string} locale a string of language_region for example: "en_GB"
* @return {string} the language part of a locale
*/
function extractLanguageFromLocale(locale) {
  const [language] = locale.split('_');
  return language;
}

/**
* Generates button objects
* @param {string} type type of button according to the Send API.
* @param {array} titles array of strings from which to create text buttons
* @param {array} payloads array of objects {title, payload} to override using
 titles as payloads
* @return {array} array of messenger button objects
*/
function generateButtonObject(type, titles, payloads) {
  if (payloads) {
    return payloads.map(({title, payload}) => (
      {type,
       title,
       payload,
      }));
  } else {
    return titles.map((title) => ({
      type,
      title,
      payload: title,
    }));
  }
}

/**
 * Generate button template for quick Yes/No answers. Max 3 buttons.
 * @param {string} text the question
 * @param {array} titles array of strings that will make the button titles
 * @param {array} payloads array of objects {title, payload} to override using
 titles as payloads
 * @return {object} a messenger button template object
*/
function generateButtonTemplate(text, titles, payloads) {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text,
        buttons: generateButtonObject('postback', titles, payloads),
      },
    },
  };
}

/**
* Generate a messenger quick reply
* @param {string} text the question text
* @param {array} replyArray an array of up to 11 objects that is, the answers
* @return {object} a quick reply object
*/
function generateQuickReply(text, replyArray) {
  return {
    text,
    quick_replies: replyArray,
  };
}

/**
* Handle breaks in the currently running conversation
* @param {object} response the response object
* @param {object} conversation the conversation object
* @param {function} callback default function to call
* @return {function} the function to direct the conversation
*/
function conversationSwitch(response, conversation, callback) {
  if (['restart',
       'hello',
       'hi',
       'start',
       'switch_en',
       'switch_pt',
       'switch_in'].includes(response.text)) {
    return conversation.stop('interrupted');
  } else {
    return callback;
  }
}

/**
* Go to the next conversation.
* @param {object} response the response object
* @param {object} conversation the conversation object
* @return {function} calling converationSwitch with conversation.next()
*/
function nextConversation(response, conversation) {
  conversation.setTimeout(Config.conversationTimeout);
  return conversationSwitch(response, conversation, conversation.next());
}

/**
* Which conversation thread to go to
* @param {string} threadName the name of the thread to go to next
* @return {function} result of calling conversationSwitch with the threadName
*/
function goto(threadName) {
  return (response, conversation) => {
    conversation.setTimeout(Config.conversationTimeout);
    conversationSwitch(response,
                         conversation,
                         conversation.gotoThread(threadName));
  };
}

/**
* Send a message to a facebookId, they have to have opted in
* @param {object} bot a bot returned from calling `spawn`
* @param {string} facebookId messenger id
* @param {function} messageCallback callback to pass to startConversation
*/
function sendMessage(bot, facebookId, messageCallback) {
  bot.startConversation({user: facebookId, channel: facebookId},
                        messageCallback);
}


module.exports = {
  extractLanguageFromLocale,
  generateButtonObject,
  nextConversation,
  goto,
  generateButtonTemplate,
  generateQuickReply,
  sendMessage,
};
