const express = require('express');
// const axios = require('axios');
const CourseModel = require('../models/courses');
const router = express.Router();
const getNextSequence = require('../utils/index');
const courseSchema = require('../schemas/course');


router.get('/courses', async (req, res) => {
  try {
    // Extrair parâmetros da query da requisição
    const { skip, limit, q, sort } = req.query;

    // Variavel para filtro
    let filter = {}

    if (q) {
      filter = {
        $or: [
          { title: { $regex: q, $options: 'i' } }, // O uso de $regex permite uma busca case-insensitive
          { brand: { $regex: q, $options: 'i' } },
        ],
      };
    }

    // Validar se todos os parâmetros necessários foram fornecidos
    if (!skip || !limit) {
      return res.status(400).json({ error: 'Parâmetros inválidos' });
    }

    const skipInt = parseInt(skip);
    const limitInt = parseInt(limit);

    // Configurar a opção de ordenação com base no parâmetro 'sort'
    let sortOption = {
      title: 1,
    };
    if (sort) {
      // Verificar se 'sort' é 'title' ou 'brand' e definir a opção de ordenação correspondente
      if (sort.toLowerCase() === 'title') {
        sortOption = {
          title: 1
        };
      }
      if (sort.toLowerCase() === 'brand') {
        sortOption = {
          brand: 1
        };
      }
    }

    // Consulta ao banco de dados para obter os cursos com base no skip e limit
    const courses = await CourseModel.find(filter).skip(skipInt).limit(limitInt).sort(sortOption);

    // Contagem total de cursos no banco de dados
    const totalCourses = await CourseModel.countDocuments();

    // Resposta com os cursos filtrados e informações adicionais
    res.json({
      courses: courses,
      limit: parseInt(limit),
      skip: parseInt(skip),
      total: totalCourses,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

router.post('/courses', async (req, res) => {
  try {
    // Validação dos dados
    if (Array.isArray(req.body)) {
      // Se o corpo da requisição é uma matriz, criamos vários cursos
      const courses = await Promise.all(req.body.map(async (courseData) => {

        try {
          await courseSchema.validate(courseData, { abortEarly: false });
        } catch (validationError) {
          return res.status(400).json({ error: validationError.errors });
        }

        const courseId = await getNextSequence('courseId');
        const newCourse= new CourseModel({
          id: courseId,
          ...courseData,
        });
        await newCourse.save();
        return newCourse;
      }));

      return res.status(200).json({ message: 'Cursos criados com sucesso', courses });
    } else {

      try {
        await courseSchema.validate(req.body, { abortEarly: false });
      } catch (validationError) {
        return res.status(400).json({ error: validationError.errors });
      }
      // Se o corpo da requisição é um único objeto, criamos um único curso
      const courseId = await getNextSequence('courseId');
      const newCourse = new CourseModel({
        id: courseId,
        ...req.body,
      });
      await newCourse.save();
      return res.status(200).json(newCourse);
    }
  } catch (error) {
    // Resposta com status 500 (Internal Server Error) em caso de erro interno
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

router.get('/courses/:id', async (req, res) => {
  const courseId = req.params.id
  try {
    const course = await CourseModel.findOne({ id: courseId });
    res.status(200).json(course)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

router.put('/courses/:id', async (req, res) => {
  const courseId = req.params.id;

  try {
    // Verifica se o curso com o ID fornecido existe no banco de dados
    const existingCourse = await CourseModel.findOne({ id: courseId });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    try {
      await courseSchema.validate(req.body, { abortEarly: false });
    } catch (validationError) {
      return res.status(400).json({ error: validationError.errors });
    }

    // Atualiza os campos do curso com os dados fornecidos no corpo da requisição
    Object.assign(existingCourse, req.body);

    // Salva as alterações no banco de dados
    await existingCourse.save();

    res.status(200).json(existingCourse);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  try {
    const existingCourse = await CourseModel.findOne({ id: courseId });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    await existingCourse.deleteOne({ id: courseId })

    return res.status(200).json({ message: 'Curso excluído com sucesso' });

  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

module.exports = router;
