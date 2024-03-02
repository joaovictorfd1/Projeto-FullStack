const request = require('supertest');
const app = require('../index');
const axios = require('axios');
const User = require('../models/user');
const router = require('../routes/product');
const ProductModel = require('../models/product');
const getNextSequence = require('../utils');

app.use('/', router);

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

// Teste para GET /products
describe('Testando rotas de produtos', () => {

  it('deve retornar a lista de produtos', async () => {
    const response = await request(app).get('/products').query({skip: 0, limit: 15});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
    expect(response.body.products).toBeInstanceOf(Array);
  });

  it('deve criar um novo produto', async () => {
    const newProduct = {
      title: 'Novo Produto',
      description: 'Descrição do Novo Produto',
      price: 19.99,
      brand: 'Marca Nova',
      category: ['Categoria Nova'],
      thumbnail: 'https://example.com/novo-produto-thumbnail.jpg',
      images: ['https://example.com/novo-produto-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    };

    const response = await request(app).post('/products').send(newProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('deve atualizar um produto existente', async () => {
    const productId = await getNextSequence('productId');
    // Primeiro, crie um produto para ser atualizado
    const newProduct = new ProductModel({
      id: productId,
      title: 'Novo Produto',
      description: 'Descrição do Novo Produto',
      price: 19.99,
      brand: 'Marca Nova',
      category: ['Categoria Nova'],
      thumbnail: 'https://example.com/novo-produto-thumbnail.jpg',
      images: ['https://example.com/novo-produto-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    });
    await newProduct.save();

    // Em seguida, atualize o produto
    const updatedProduct = {
      title: 'Produto Atualizado',
      description: 'Descrição do Produto Atualizado',
      price: 300.00,
      brand: 'Marca Atualizada',
      category: ['Categoria Nova', 'Categoria atualizada'],
      thumbnail: 'https://example.com/novo-produto-thumbnail.jpg',
      images: ['https://example.com/novo-produto-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    };

    const response = await request(app).put(`/products/${newProduct.id}`).send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', newProduct.id);
    expect(response.body.title).toBe(updatedProduct.title);
    expect(response.body.price).toBe(updatedProduct.price);
  });

  it('deve excluir um produto existente', async () => {
    const productId = await getNextSequence('productId');
    // Primeiro, crie um produto para ser excluído
    const newProduct = new ProductModel({
      id: productId,
      title: 'Produto a ser Excluído',
      description: 'Descrição do Produto a ser Excluído',
      price: 49.99,
      brand: 'Marca a ser Excluída',
      category: ['Categoria a ser Excluída'],
      thumbnail: 'https://example.com/produto-a-ser-excluido-thumbnail.jpg',
      images: ['https://example.com/produto-a-ser-excluido-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    });
    await newProduct.save();

    // Em seguida, exclua o produto
    const response = await request(app).delete(`/products/${newProduct.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Produto excluído com sucesso');
  });
});