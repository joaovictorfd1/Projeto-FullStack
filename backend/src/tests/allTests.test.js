const request = require('supertest');
const app = require('../index');
const User = require('../models/user');

describe('Testando Rotas de Cadastro de Usuários', () => {
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
});

describe('Testando rotas de login e cadastro' , () => {
  test('Deve realizar login com sucesso', async () => {
    // Supondo que você tenha um usuário válido no banco de dados
    const userCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    // Registra o usuário para garantir que ele exista
    await request(app)
      .post('/register')
      .send(userCredentials)
      .expect(200);

    // Realiza o login
    const response = await request(app)
      .post('/login')
      .send(userCredentials)
      .expect(200);

    // Verifica se a resposta contém as propriedades email e token
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('token');
  });

  test('Deve realizar login com erro', async () => {
    const userCredentials = {
      email: 'teste@example.com',
      password: 'password123',
    }

    // Realiza o login
    const response = await request(app)
      .post('/login')
      .send(userCredentials)
      .expect(404);

    expect(response.body.error).toBe('Usuário não encontrado');
  })
})