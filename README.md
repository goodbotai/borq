[![NPM](https://nodei.co/npm/borq.png?downloads=true&stars=true)](https://nodei.co/npm/borq/)

[![Build Status](https://travis-ci.org/goodbotai/borq.svg?branch=master)](https://travis-ci.org/goodbotai/borq)

# Borq
Short for Bot Orchestration, borq is a Bot orchestration framework aimed at
making it easy for people to make bots that have register users and manage them
in RapidPro and save bot and user conversations in Ona.

## Target platforms
Current:
 - Facebook messenger

Todo:
 - Telegram

## Run an example bot
```javascript
const borq = require('borq');

const {
  facebookUtils,
  facebookBot,
  services,
  config,
  http,
  localeUtils,
} = borq;

const {
  nextConversation,
  goto,
  generateButtonTemplate,
  generateQuickReply,
  sendMessage,
} = facebookUtils;

const bot = facebookBot.spawn({});

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
```

## Documentation
 * [Deploying](https://github.com/goodbotai/borq/blob/master/docs/Deploying.md)
 * [Environment variables](https://github.com/goodbotai/borq/blob/master/docs/Environment%20Variables.md)
 * [Persistence](https://github.com/goodbotai/borq/blob/master/docs/Persistence.md)
 * [Testing](https://github.com/goodbotai/borq/blob/master/docs/Testing.md)
 * [API Docs](https://goodbotai.github.io/borq)

# License
[BSD-2-Clause](LICENSE)
