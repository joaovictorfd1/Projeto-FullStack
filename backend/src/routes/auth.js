const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
const userSchema = require('../schemas/user');

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

module.exports = router;