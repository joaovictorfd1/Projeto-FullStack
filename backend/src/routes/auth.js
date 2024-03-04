const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const userSchema = require('../schemas/user');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  // Remova o prefixo 'Bearer ' do token
  const tokenWithoutBearer = token.replace('Bearer ', '');

  jwt.verify(tokenWithoutBearer, 'token', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

router.get('/auth/me', verifyToken, (req, res) => {
  // O middleware verifyToken já validou o token, e os dados do usuário estão em req.user
  res.json({ userId: req.user.userId });
});

router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body)
    try {
      await userSchema.validate(req.body, { abortEarly: false });
    } catch (validationError) {
      return res.status(400).json({ error: validationError.errors });
    }
    await newUser.save();
    res.status(200).json(newUser)
  } catch (e) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ userId: user._id }, 'token', { expiresIn: '1h' });
    res.json({ email: user.email, token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    const totalUsers = await User.countDocuments();
    res.json({
      users: users,
      total: totalUsers,
    });
  } catch(e) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
})

module.exports = router;