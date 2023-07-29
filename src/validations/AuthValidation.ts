import * as yup from "yup";

export const RegisterSchema = yup.object().shape({
  firstName: yup.string().required().max(255),
  lastName: yup.string().required().max(255),
  email: yup.string().required().email(),
  password: yup.string().matches(/[0-9]/).matches(/[a-z]/).matches(/[A-Z]/).required().min(8).max(32),
});

export const LoginSchema = yup.object().shape({
  email:yup.string().required().email(),
  password:yup.string().matches(/[0-9]/).matches(/[a-z]/).matches(/[A-Z]/).required().min(8).max(32),
})
