const yup = require('yup');

const courseSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required().positive(),
  discountPercentage: yup.number().min(0).max(100).required(),
  rating: yup.number().min(0).max(10).required(),
  stock: yup.number().integer().min(0).required(),
  brand: yup.string().required(),
  category: yup.array().of(yup.string()).required(),
  thumbnail: yup.string().url().notRequired(),
  images: yup.array().of(yup.string()).required(),
});

module.exports = courseSchema