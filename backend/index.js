const express = require('express');
const mongoose = require('mongoose');

const PORT = 80;
const HOST = '0.0.0.0';

mongoose.connect('mongodb://mongodb:27017/beta-desafio', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);