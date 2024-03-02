import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const SingUpSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const ProductSchema = Yup.object().shape({
  title: Yup.string().required('O título é obrigatório'),
  description: Yup.string().required('A descrição é obrigatória'),
  price: Yup.number().positive('O preço deve ser um número positivo').required('O preço é obrigatório'),
  discountPercentage: Yup.number().min(0, 'A porcentagem de desconto não pode ser negativa'),
  rating: Yup.number().min(0, 'A classificação não pode ser negativa'),
  stock: Yup.number().integer().min(0, 'O estoque não pode ser negativo').required('O estoque é obrigatório'),
  brand: Yup.string(),
  category: Yup.array().of(Yup.string()),
  thumbnail: Yup.string().url('A thumbnail deve ser uma URL válida').nullable(),
  images: Yup.array().of(Yup.string().url('As imagens devem ser URLs válidas')),
});