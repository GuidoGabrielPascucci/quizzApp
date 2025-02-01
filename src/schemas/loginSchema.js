import { object, pipe, string, nonEmpty, email, minLength, maxLength } from "valibot";

const emailSchema = pipe(
  string(),
  nonEmpty('Please enter your email.'),
  email('The email is badly formatted.'),
  maxLength(254, 'Your email is too long.')
);

const passwordSchema = pipe(
  string(),
  nonEmpty('Please enter your password.'),
  minLength(6, "Password must have 6 characters at least.")
)

export const loginSchema = object({
  email: emailSchema,
  password: passwordSchema,
});



// VALIDACIONES PARA EL CORREO:



// VALIDACIONES PARA LA CONTRASEÑA:
// Longitud mínima ====> 6 caracteres
// Validaciones adicionales:
  // Mayúsculas
  // Minúsculas
  // Números
  // Caracteres especiales