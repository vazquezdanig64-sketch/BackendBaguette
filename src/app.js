import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

import { pedidosRoutes } from "./rutas/pedidos.js";
import { usuarioRoutes } from "./rutas/usuarios.js";

const app = express();

// --- 1. CONFIGURACIÓN DE SEGURIDAD (HELMET Y CORS) ---

app.use(helmet());

// Fase 3 (Logro 2): CORS Dinámico y Flexible
app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Permitimos si no hay origen (Postman o llamadas locales del servidor)
      // 2. Permitimos localhost
      // 3. Permitimos CUALQUIER subdominio de vercel.app para evitar errores de despliegue
      if (
        !origin ||
        origin.startsWith("http://localhost") ||
        origin.endsWith(".vercel.app") ||
        origin === process.env.FRONTEND_URL
      ) {
        callback(null, true);
      } else {
        callback(
          new Error(
            "Acceso denegado: Este dominio no está autorizado por la política CORS de Leños Rellenos.",
          ),
        );
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  }),
);

app.use(bodyParser.json());

// --- 2. CONFIGURACIÓN DEL "FORTÍN" (RATE LIMITING) ---

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15, // Aumentamos un poco a 15 por si haces pruebas rápidas
  message: {
    error: "Demasiadas peticiones. Por favor, intenta de nuevo en un minuto.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// --- 3. EL "CÍRCULO DE SEGURIDAD" (MIDDLEWARE API KEY) ---

app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/health") return next();

  const apiKey = req.headers["x-api-key"];

  // Usamos 'full-stack' como respaldo por si la variable de entorno falla
  const validApiKey = process.env.API_KEY || "full-stack";

  if (apiKey && apiKey === validApiKey) {
    next();
  } else {
    res.status(403).json({
      error: "Acceso denegado: Se requiere una API KEY válida.",
    });
  }
});

// --- 4. INTEGRACIÓN DE RUTAS ---

pedidosRoutes(app);
usuarioRoutes(app);

// --- 5. ENDPOINT SEGURO PARA COMENTARIOS ---

app.post(
  "/api/comentarios",
  [
    body("puntuacion")
      .isInt()
      .withMessage("La puntuación debe ser un número entero."),
    body("texto")
      .trim()
      .escape()
      .isLength({ max: 200 })
      .withMessage("Máximo 200 caracteres."),
  ],
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { texto, puntuacion } = req.body;
    res.json({
      status: "success",
      message: "Comentario procesado de forma segura en la nube.",
      data: {
        comentarioRecibido: texto,
        puntuacion,
        fecha: new Date().toLocaleDateString(),
      },
    });
  },
);

app.get("/", (req, res) => {
  res.send("¡Hola Daniela! Servidor de Leños Rellenos activo y protegido.");
});

export { app };
