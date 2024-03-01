const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  id: { type: String, primaryKey: true, autoIncrement: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Antes de salvar, criptografa a senha
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;