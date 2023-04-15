const chatbot = require('../chatbot/chatbot');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,

  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,

  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
};

module.exports = function (app) {
  app.post('/text_query', cors(corsOptions), async (req, res) => {
    // console.log(req);

    const { text, userId } = req.body;
    const resultQuery = await chatbot.textQuery(text, userId);
    // console.log(resultQuery);
    // res.send(resultQuery.fulfillmentMessages[0].text.text[0]);
    res.send(resultQuery.fulfillmentText);
    // res.send('This is a response from the Text Query route');
  });
};
