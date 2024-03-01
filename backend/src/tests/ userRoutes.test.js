const request = require('supertest');
const app = require('../index'); // Certifique-se de que esteja fornecendo o caminho correto para o seu aplicativo principal
const User = require('../models/user');

describe('Testando Rotas de Usuário', () => {

  beforeEach(async () => {
    await User.deleteMany();
  });

  test('Deve criar um novo usuário', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);

    // Realize as asserções necessárias sobre a resposta
    expect(response.body.email).toBe('test@example.com');
  });

  test('Deve lidar com erro de e-mail inválido', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'invalidemail', password: 'password123' })
      .expect(400);

    // Realize as asserções necessárias sobre a resposta
    expect(response.body.error).toBe('E-mail inválido');
  });

  test('Deve lidar com erro de senha', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'test2@example.com', password: '12345' })
      .expect(400);

    // Realize as asserções necessárias sobre a resposta
    expect(response.body.error).toBe('Senha deve ter no mínimo 6 caracteres');
  });

  // Adicione mais testes conforme necessário
});
