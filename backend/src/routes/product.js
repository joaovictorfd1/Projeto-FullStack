const express = require('express');
const axios = require('axios');
const ProductModel = require('../models/product');
const router = express.Router();
const getNextSequence = require('../utils/index');


router.post('/products', async (req, res) => {
  try {
    // Validação dos dados
    if (Array.isArray(req.body)) {
      // Se o corpo da requisição é uma matriz, criamos vários produtos
      const products = await Promise.all(req.body.map(async (productData) => {
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

router.get('/products', async (req, res) => {
  try {
    // Extrair parâmetros da query da requisição
    const { skip, limit, q } = req.query;

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

    // Consulta ao banco de dados para obter os produtos com base no skip e limit
    const produtos = await ProductModel.find(filter).skip(skipInt).limit(limitInt).sort({ id: 1 });

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
    console.error('Erro ao processar a requisição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

// router.get('/products', async (req, res) => {
//   const query = req.query
//   try {
//     // Chame a URL externa usando axios
//     const response = await axios.get(`https://dummyjson.com/products${query.q ? '/search' : ''}`, {
//       params: query
//     });

//     // Retorne a resposta da URL externa para o cliente
//     res.json(response.data);
//   } catch (error) {
//     // Lide com erros, se necessário
//     console.error('Erro ao chamar a URL externa:', error.message);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });

// router.post('/products', async (req, res) => {
//   try {
//     const response = await axios.post('https://dummyjson.com/products/add', req.body)
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// })

// router.put('/products/:id', async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const response = await axios.put(`https://dummyjson.com/products/${productId}`, req.body)
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// })

// router.delete('/products/:id', async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const response = await axios.delete(`https://dummyjson.com/products/${productId}`)
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// })

module.exports = router;
