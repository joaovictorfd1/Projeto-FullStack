const yup = require('yup');

const userSchema = yup.object().shape({
  email: yup.string().email('O e-mail fornecido é inválido').required(),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required(),
});

module.exports = userSchema