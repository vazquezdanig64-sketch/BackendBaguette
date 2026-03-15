import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Importar las rutas
import { pedidosRoutes } from "./rutas/pedidos.js";
import { usuarioRoutes } from "./rutas/usuarios.js";

// Crear la aplicación Express
const app = express();

// Configurar middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Permite solo a tu frontend de Vite
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(bodyParser.json());

// Configurar rutas de la API
pedidosRoutes(app);
usuarioRoutes(app);

// Ruta de prueba inicial
app.get("/", (req, res) => {
  res.send("Hola desde Express! El servidor de pedidos está activo.");
});

export { app };
