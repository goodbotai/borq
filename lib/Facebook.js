const winston = require('winston');
const expressWinston = require('express-winston');
const Botkit = require('botkit');

const Services = require('./Services.js');
const Config = require('../config/Config.js');

const karma = Botkit.facebookbot({
  logger: new winston.Logger({
    transports: [
      new (winston.transports.Console)({level: 'debug'}),
    ],
  }),
  debug: true,
  log: true,
  access_token: Config.facebookPageAccessToken,
  verify_token: Config.facebookVerifyToken,
  app_secret: Config.facebookAppSecret,
  receive_via_postback: true,
  validate_requests: true,
  stats_optout: true,
});

karma.setupWebserver(Config.PORT, (err, webserver) => {
  if (Config.environment === 'production') {
    webserver.use(Services.sentry.requestHandler());
  }

  webserver.use(expressWinston.logger({
    transports: [
      new winston.transports.File({
        filename: Config.karmaAccessLogFile,
        logstash: true,
        zippedArchive: true,
      })],
  }));

  karma.createWebhookEndpoints(webserver, karma.spawn({}), () => {
  });

  webserver.get('/', (req, res) => {
    const html = '<h3>borq helps you make bots</h3>';
    res.send(html);
  });

  webserver.post('/trigger', (req, res) => {
    const facebookId = req.body.urn.split(':')[1];
    const response = res;
    response.statusCode = 200;
    response.send();
  });

  if (Config.environment === 'production') {
    webserver.use(Services.sentry.errorHandler());
  }
});


module.exports = {
  karma,
};
