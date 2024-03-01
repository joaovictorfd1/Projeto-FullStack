const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/products', async (req, res) => {
  const query = req.query
  try {
    // Chame a URL externa usando axios
    const response = await axios.get(`https://dummyjson.com/products${query.q ? '/search' : ''}`, {
      params: query
    });
    
    // Retorne a resposta da URL externa para o cliente
    res.json(response.data);
  } catch (error) {
    // Lide com erros, se necessário
    console.error('Erro ao chamar a URL externa:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const response = await axios.post('https://dummyjson.com/products/add', req.body)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await axios.put(`https://dummyjson.com/products/${productId}`, req.body)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await axios.delete(`https://dummyjson.com/products/${productId}`)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

module.exports = router;
