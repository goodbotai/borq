/**
* Generates button objects
* @param {array} collection coll of strings from which to create text buttons
* @return {array} array of messenger button objects
*/
function generateButtonObject(collection) {
  return collection.map((element) => ({
    content_type: 'text',
    title: element,
    payload: element,
  }));
}

/**
* Splits a locale into language and region but only returns language
* @param {string} locale a string of language_region for example: "en_GB"
* @return {string} the language part of a locale
*/
function extractLanguageFromLocale(locale) {
  const [language] = locale.split('_');
  return language;
}

// TO DO: generalise the generateButtonobjec
/**
 * Generate button template for quick Yes/No answers
 * @param {string} text the question
 * @param {string} yesTitle yes text (needed for translations)
 * @param {string} noTitle no text (needed for translations)
 * @param {string} yesPayload payload for a yes answer
 * @param {string} noPayload payload for a yes answer
 * @return {object} a messenger button template object
*/
function generateYesNoButtonTemplate(text,
                                     yesTitle,
                                     noTitle,
                                     yesPayload,
                                     noPayload) {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text,
        buttons: [{
          type: 'postback',
          title: yesTitle,
          payload: yesPayload,
        }, {
          type: 'postback',
          title: noTitle,
          payload: noPayload,
        }],
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
    conversation.stop('interrupted');
    return conversation.next();
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
  return conversationSwitch(response, conversation, conversation.next());
}

/**
* Which conversation thread to go to
* @param {string} threadName the name of the thread to go to next
* @return {function} result of calling conversationSwitch with the threadName
*/
function goto(threadName) {
  return (response, conversation) => {
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
  generateYesNoButtonTemplate,
  generateQuickReply,
  sendMessage,
};
