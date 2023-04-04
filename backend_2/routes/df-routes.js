const chatbot = require('../chatbot/chatbot');

module.exports = function (app) {
  app.post('/text_query', async (req, res) => {
    // console.log(req);

    const { text, userId } = req.body;
    const resultQuery = await chatbot.textQuery(text, userId);
    // console.log(resultQuery);
    // res.send(resultQuery.fulfillmentMessages[0].text.text[0]);
    res.send(resultQuery.fulfillmentText);
    // res.send('This is a response from the Text Query route');
  });
};
