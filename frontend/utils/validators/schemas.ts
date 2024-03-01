import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const SingUpSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});