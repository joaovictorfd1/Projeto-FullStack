const request = require('supertest');
const app = require('../index');
const axios = require('axios');
const User = require('../models/user');
const router = require('../routes/courses');
const getNextSequence = require('../utils');
const CourseModel = require('../models/courses');

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
    expect(response.body.error[0]).toBe('O e-mail fornecido é inválido');
  });

  test('Deve lidar com erro de senha', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'test2@example.com', password: '12345' })
      .expect(400);

    // Realize as asserções necessárias sobre a resposta
    expect(response.body.error[0]).toBe('A senha deve ter pelo menos 6 caracteres');
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

describe('Testando rotas de cursos', () => {

  it('deve retornar a lista de cursos', async () => {
    const response = await request(app).get('/courses').query({skip: 0, limit: 15});
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('courses');
    expect(response.body.courses).toBeInstanceOf(Array);
  });

  it('deve criar um novo curso', async () => {
    const newCourse = {
      title: 'Novo Curso',
      description: 'Descrição do Novo Curso',
      price: 19.99,
      brand: 'Marca Nova',
      category: ['Categoria Nova'],
      thumbnail: 'https://example.com/novo-curso-thumbnail.jpg',
      images: ['https://example.com/novo-curso-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    };

    const response = await request(app).post('/courses').send(newCourse);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('deve atualizar um curso existente', async () => {
    const courseId = await getNextSequence('courseId');
    // Primeiro, crie um curso para ser atualizado
    const newCourse = new CourseModel({
      id: courseId,
      title: 'Novo Curso',
      description: 'Descrição do Novo Curso',
      price: 19.99,
      brand: 'Marca Nova',
      category: ['Categoria Nova'],
      thumbnail: 'https://example.com/novo-curso-thumbnail.jpg',
      images: ['https://example.com/novo-curso-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    });
    await newCourse.save();

    // Em seguida, atualize o Curso
    const updatedProduct = {
      title: 'Curso Atualizado',
      description: 'Descrição do Curso Atualizado',
      price: 300.00,
      brand: 'Marca Atualizada',
      category: ['Categoria Nova', 'Categoria atualizada'],
      thumbnail: 'https://example.com/novo-curso-thumbnail.jpg',
      images: ['https://example.com/novo-curso-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    };

    const response = await request(app).put(`/courses/${newCourse.id}`).send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', newCourse.id);
    expect(response.body.title).toBe(updatedProduct.title);
    expect(response.body.price).toBe(updatedProduct.price);
  });

  it('deve excluir um curso existente', async () => {
    const productId = await getNextSequence('productId');
    // Primeiro, crie um curso para ser excluído
    const newCourse = new CourseModel({
      id: productId,
      title: 'Curso a ser Excluído',
      description: 'Descrição do Curso a ser Excluído',
      price: 49.99,
      brand: 'Marca a ser Excluída',
      category: ['Categoria a ser Excluída'],
      thumbnail: 'https://example.com/curso-a-ser-excluido-thumbnail.jpg',
      images: ['https://example.com/curso-a-ser-excluido-imagem1.jpg'],
      rating: 0,
      discountPercentage: 10,
      stock: 1,
    });
    await newCourse.save();

    // Em seguida, exclua o curso
    const response = await request(app).delete(`/courses/${newCourse.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Curso excluído com sucesso');
  });
});