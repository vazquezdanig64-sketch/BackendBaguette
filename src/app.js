import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Importar las rutas
import { pedidosRoutes } from "./rutas/pedidos.js";
import { usuarioRoutes } from "./rutas/usuarios.js";

// Crear la aplicación Express
const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---

app.use(
  cors({
    // IMPORTANTE: Se agregó "https://" al inicio para que el navegador lo reconozca
    origin: "https://frontend-production-4a4a1.up.railway.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Middleware para leer el cuerpo de las peticiones (JSON)
app.use(bodyParser.json());

// --- CONFIGURACIÓN DE RUTAS ---

// Pasamos la instancia de 'app' a tus archivos de rutas
pedidosRoutes(app);
usuarioRoutes(app);

// Ruta de prueba inicial para verificar que el Backend esté vivo
app.get("/", (req, res) => {
  res.send(
    "¡Hola Daniela! El servidor de Leños Rellenos está activo y conectado.",
  );
});

// Exportamos 'app' para que index.js lo use con el puerto correcto
export { app };
