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

module.exports = router;
