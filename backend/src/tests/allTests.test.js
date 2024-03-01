const request = require('supertest');
const app = require('../index');
const axios = require('axios');
const User = require('../models/user');
const router = require('../routes/product');

app.use('/', router);
jest.mock('axios');

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

describe('Teste da listagem de produtos com a API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('deve retornar dados da URL externa sem parâmetros', async () => {
    axios.get.mockResolvedValue({ data: 'dados simulados' });

    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual('dados simulados');
    expect(axios.get).toHaveBeenCalledWith('https://dummyjson.com/products', { params: {} });
  });

  it('deve retornar dados da URL externa com parâmetros', async () => {
    axios.get.mockResolvedValue({ data: 'dados simulados' });

    const response = await request(app).get('/products').query({ q: 'searchTerm' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual('dados simulados');
    expect(axios.get).toHaveBeenCalledWith('https://dummyjson.com/products/search', { params: { q: 'searchTerm' } });
  });

  it('deve lidar com erros ao chamar a URL externa', async () => {
    axios.get.mockRejectedValue(new Error('Erro simulado'));

    const response = await request(app).get('/products');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro interno do servidor' });
    expect(axios.get).toHaveBeenCalledWith('https://dummyjson.com/products', { params: {} });
  });
});