const express = require('express');
// const axios = require('axios');
const ProductModel = require('../models/product');
const router = express.Router();
const getNextSequence = require('../utils/index');
const productSchema = require('../schemas');


router.get('/products', async (req, res) => {
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

    // Consulta ao banco de dados para obter os produtos com base no skip e limit
    const produtos = await ProductModel.find(filter).skip(skipInt).limit(limitInt).sort(sortOption);

    // Contagem total de produtos no banco de dados
    const totalProdutos = await ProductModel.countDocuments();

    // Resposta com os produtos filtrados e informações adicionais
    res.json({
      products: produtos,
      limit: parseInt(limit),
      skip: parseInt(skip),
      total: totalProdutos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

router.post('/products', async (req, res) => {
  try {
    // Validação dos dados
    if (Array.isArray(req.body)) {
      // Se o corpo da requisição é uma matriz, criamos vários produtos
      const products = await Promise.all(req.body.map(async (productData) => {

        try {
          await productSchema.validate(productData, { abortEarly: false });
        } catch (validationError) {
          return res.status(400).json({ error: 'Erro de validação', details: validationError.errors });
        }

        const productId = await getNextSequence('productId');
        const newProduct = new ProductModel({
          id: productId,
          ...productData,
        });
        await newProduct.save();
        return newProduct;
      }));

      return res.status(200).json({ message: 'Produtos criados com sucesso', products });
    } else {

      try {
        await productSchema.validate(req.body, { abortEarly: false });
      } catch (validationError) {
        return res.status(400).json({ error: 'Erro de validação', details: validationError.errors });
      }
      // Se o corpo da requisição é um único objeto, criamos um único produto
      const productId = await getNextSequence('productId');
      const newProduct = new ProductModel({
        id: productId,
        ...req.body,
      });
      await newProduct.save();
      return res.status(200).json(newProduct);
    }
  } catch (error) {
    // Resposta com status 500 (Internal Server Error) em caso de erro interno
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

router.put('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Verifica se o produto com o ID fornecido existe no banco de dados
    const existingProduct = await ProductModel.findOne({ id: productId });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    try {
      await productSchema.validate(req.body, { abortEarly: false });
    } catch (validationError) {
      return res.status(400).json({ error: 'Erro de validação', details: validationError.errors });
    }

    // Atualiza os campos do produto com os dados fornecidos no corpo da requisição
    Object.assign(existingProduct, req.body);

    // Salva as alterações no banco de dados
    await existingProduct.save();

    res.status(200).json(existingProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const existingProduct = await ProductModel.findOne({ id: productId });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await existingProduct.deleteOne({ id: productId })

    return res.status(200).json({ message: 'Produto excluído com sucesso' });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

module.exports = router;
