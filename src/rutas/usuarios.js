import {
  createUsuario,
  loginUsuario,
  getUsuarioInfoById,
} from "../servicios/usuarios.js";

export function usuarioRoutes(app) {
  // Ruta para registrar un nuevo usuario (Signup)
  app.post("/api/v1/usuario/signup", async (req, res) => {
    try {
      const usuario = await createUsuario(req.body);
      return res.status(201).json({
        username: usuario.username,
      });
    } catch (err) {
      return res.status(400).json({
        error: "Falló al crear el usuario. ¿El usuario ya existe?",
      });
    }
  });

  // Ruta para iniciar sesión (Login)
  app.post("/api/v1/usuario/login", async (req, res) => {
    try {
      const token = await loginUsuario(req.body);
      return res.status(200).send({
        token,
      });
    } catch (err) {
      // Este es el error 400 que te salía en Postman
      return res.status(400).send({
        error: "Login Falló. ¿Ingresaste el Usuario/Contraseña correcta?",
      });
    }
  });

  // Ruta para obtener información de un usuario por su ID
  app.get("/api/v1/usuarios/:id", async (req, res) => {
    try {
      const userInfo = await getUsuarioInfoById(req.params.id);
      return res.status(200).send(userInfo);
    } catch (err) {
      return res.status(404).send({
        error: "Usuario no encontrado",
      });
    }
  });
}
