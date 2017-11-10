const {facebook} = require('./lib/Borq.js');
const {controller} = facebook;
const botty = controller.spawn({});

/*
* Set Messenger Profile API
* https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api
*/
facebook.setMenu([
  {
    locale: 'default',
    composer_input_disabled: true,
    call_to_actions: [
         {
           title: 'Restart',
           type: 'postback',
           payload: 'restart',
         }, {
           title: 'Other',
           type: 'postback',
           payload: 'other',
         }, {
           type: 'web_url',
           title: 'FAQ',
           url: 'https://goodbotai.github.io/borq/',
           webview_height_ratio: 'full',
         },
       ],
  },
]);
facebook.setGetStarted('start');
facebook.setGreeting('Hello, I am a bot.');

controller.on('facebook_postback', (bot, message) => {
  if (message.payload === 'start') {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Welcome to my lair!');
    });
  } else {
    bot.startConversation(message, (err, convo) => {
      convo.addMessage('Hello, you added a postback?');
    });
  }
});

controller.hears(['talk'],
                 'message_received',
                 (bot, message) => {
                   bot.startConversation(message, (err, convo) => {
                     convo.addQuestion('Say something',
                                       (res, con) => con.next());
                     convo.addQuestion('Ok bye', (res, con) => con.next());
                   });
                 });

facebook.start(botty, (err, webserver) => {
  // Add routes for your bot to listen on
  webserver.get('/', (req, res) => {
    res.send('<h3>This is a bot</h3>');
  });
});
