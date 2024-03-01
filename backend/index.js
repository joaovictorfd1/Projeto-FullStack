const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const User = require('./models/user');
const authRouter = require('./routes/auth');
const cors = require('cors');

const app = express();
const PORT = 80;
const HOST = '0.0.0.0';

// Middleware para analisar o corpo da solicitação como JSON
app.use(bodyParser.json());
app.use(cors());

// Conexão com o banco
mongoose.connect('mongodb://localhost:27017/beta-desafio', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body)
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }
    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }
    await newUser.save();
    res.status(200).json(newUser)
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      const mensagensErro = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ error: 'Erro de validação', mensagens: mensagensErro });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

app.post('/login', authRouter)

app.listen(PORT, HOST);