const yup = require('yup');
const productSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required().positive(),
  discountPercentage: yup.number().min(0).max(100).required(),
  rating: yup.number().min(0).max(5).required(),
  stock: yup.number().integer().min(0).required(),
  brand: yup.string().required(),
  category: yup.array().of(yup.string()).required(),
  thumbnail: yup.string().url().required(),
  images: yup.array().of(yup.string().url()).required(),
});

module.exports = productSchema