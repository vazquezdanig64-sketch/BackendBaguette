import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../bd/modelos/usuario.js";

/**
 * Crea un nuevo usuario con la contraseña encriptada
 */
export async function createUsuario({ username, password }) {
  // El número 10 es el nivel de seguridad del cifrado (salt rounds)
  const hashedPassword = await bcrypt.hash(password, 10);
  const usuario = new Usuario({ username, password: hashedPassword });
  return await usuario.save();
}

/**
 * Valida las credenciales y devuelve un token si son correctas
 */
export async function loginUsuario({ username, password }) {
  // 1. Buscar si el usuario existe
  const usuario = await Usuario.findOne({ username });
  if (!usuario) {
    throw new Error("Nombre de Usuario Incorrecto!");
  }

  // 2. Comparar la contraseña ingresada con la encriptada en la BD
  const isPasswordCorrect = await bcrypt.compare(password, usuario.password);
  if (!isPasswordCorrect) {
    throw new Error("Contraseña invalida!");
  }

  // 3. Generar el Token JWT
  // Usamos el secreto del .env o 'full-stack' por defecto para evitar errores
  const token = jwt.sign(
    { sub: usuario._id },
    process.env.JWT_SECRET || "full-stack",
    { expiresIn: "24h" },
  );

  return token;
}

/**
 * Obtiene el nombre de usuario por su ID (útil para mostrar quién hizo el pedido)
 */
export async function getUsuarioInfoById(userId) {
  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) return { username: userId };
    return { username: usuario.username };
  } catch (err) {
    return { username: userId };
  }
}
