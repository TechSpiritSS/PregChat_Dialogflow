const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,

  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,

  allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes/df-routes')(app);

app.get('/df/server', cors(corsOptions), (req, res) => {
  res.send('Hello World!  2');
});

app.listen(PORT, () => {
  console.log('Server started on port 8080');
});
