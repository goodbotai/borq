const borq = require('borq');
const facebookBot = borq.facebookBot;

/*
* Set Messenger Profile API
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
*/
facebookBot.setGetStarted('start');
facebookBot.setGreeting('Hello, I am a bot.');
facebookBot.setMenu([
  {
    locale: 'in_ID',
    composer_input_disabled: true,
    call_to_actions: [
      {
        type: 'web_url',
        title: 'FAQ',
        url: 'https://goodbotai.github.io/borq/',
        webview_height_ratio: 'full',
      },
    ],
  }, {
    locale: 'default',
    composer_input_disabled: true,
    call_to_actions: [
      {title: '',
       type: 'nested',
       call_to_actions: [
         {
           title: 'English',
           type: 'postback',
           payload: 'english',
         },
        {
          title: 'Bahasa',
          type: 'postback',
          payload: 'bahasa',
        },
       ],
      },
    ],
  },
]);

facebookBot.on('facebook_postback', (bot, message) => {
  if (message.payload === 'start') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Started');
    });
  } else if (message.payload === 'english') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Hello');
    });
  } else if (message.payload === 'bahasa') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Halo');
    });
  }
});

facebookBot.hears(['hello'],
                  'message_received',
                  (bot, message) => {
                    bot.reply(message, 'How\'s your day going?');
});

facebookBot.hears([/([a-z])\w+/gi],
                  'message_received',
                  function(bot, message) {
                    bot.reply(message, 'I don\'t know that word yet');
});
