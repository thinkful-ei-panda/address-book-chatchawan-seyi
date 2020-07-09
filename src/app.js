require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const { v4: uuid } = require('uuid');

const app = express();

const morganOption = (NODE_ENV === 'production');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
}

const addressList = [{
  id: 1234,
  firstName: 'String',
  lastName: 'String',
  address1: 'String',
  address2: 'String',
  city: 'String',
  state: 'String',
  zip: 78795
}];

app.get('/address', (req, res) => {
  res.send(addressList);
});

app.delete('/address/:userId', validateBearerToken);
app.post('/address', validateBearerToken);

app.post('/address', (req, res) => {
  const { address1, address2,  }
  const id = uuid();

  res.send(id);
});

app.delete('/address/:userId', (req, res) => {
  const { userId } = req.params;
  const index = addressList.findIndex(u => u.id === userId);
  if (index === -1) {
    return res
      .status(404)
      .send('User not found');
  }

  addressList.splice(index, 1);

  res.send('Deleted');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
