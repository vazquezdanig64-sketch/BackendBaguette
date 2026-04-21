import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../bd/modelos/usuario.js";

export async function createUsuario({ username, password }) {
  // Se aplica hash a la contraseña antes de guardar [cite: 46, 184]
  const hashedPassword = await bcrypt.hash(password, 10);
  const usuario = new Usuario({ username, password: hashedPassword });
  return await usuario.save();
}

export async function loginUsuario({ username, password }) {
  const usuario = await Usuario.findOne({ username });
  if (!usuario) throw new Error("Nombre de Usuario Incorrecto!");

  // Verifica que la clave sea válida [cite: 52, 184]
  const isPasswordCorrect = await bcrypt.compare(password, usuario.password);
  if (!isPasswordCorrect) throw new Error("Contraseña invalida!");

  // Genera el token con expiración de 24h [cite: 55, 184]
  const token = jwt.sign({ sub: usuario._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
}

export async function getUsuarioInfoById(userId) {
  try {
    const usuario = await Usuario.findById(userId);
    return usuario ? { username: usuario.username } : { username: userId };
  } catch (err) {
    return { username: userId };
  }
}
