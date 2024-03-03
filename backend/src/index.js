const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const coursesRouter = require('./routes/courses')
const cors = require('cors');

const app = express();
const PORT = 80;
const HOST = '0.0.0.0';

// Middleware para analisar o corpo da solicitação como JSON
app.use(bodyParser.json());
app.use(cors());

// Conexão com o banco
// mongoose.connect('mongodb://mongodb:27017/beta-desafio', { useNewUrlParser: true, useUnifiedTopology: true }); // Rodar no docker
// mongoose.connect('mongodb://localhost:27017/beta-desafio', { useNewUrlParser: true, useUnifiedTopology: true }); // Rodar na maquina
mongoose.connect('mongodb+srv://joaovictorfd:Chapa317036@beta-clouster.7bpqnsu.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(authRouter)

app.use(coursesRouter)

app.listen(PORT, HOST);

module.exports = app