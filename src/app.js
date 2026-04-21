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

// Helmet añade cabeceras de seguridad automáticas (Fase 4.3 de infraestructura)
app.use(helmet());

// Fase 3 (Logro 2): Configurar CORS para aceptar peticiones desde el dominio de Vercel
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  process.env.FRONTEND_URL, // URL de producción en Vercel/Railway [cite: 9]
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Se permite acceso si el origen está en la lista o si no hay origen (Postman)
      if (!origin || allowedOrigins.includes(origin)) {
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
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"], // Se añade x-api-key a los headers [cite: 27]
    credentials: true,
  }),
);

app.use(bodyParser.json());

// --- 2. CONFIGURACIÓN DEL "FORTÍN" (RATE LIMITING) ---

// Fase 1.1: Restringir a 10 peticiones por minuto [cite: 36]
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    error: "Demasiadas peticiones. Por favor, intenta de nuevo en un minuto.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// --- 3. EL "CÍRCULO DE SEGURIDAD" (MIDDLEWARE API KEY) ---

// Fase 4: Protección de API mediante x-api-key
app.use((req, res, next) => {
  // Las rutas públicas como '/' pueden excluirse si es necesario
  if (req.path === "/") return next();

  const apiKey = req.headers["x-api-key"];
  // Se compara con la variable de entorno configurada en Railway [cite: 29]
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({
      error:
        "Acceso denegado: Se requiere una API KEY válida para acceder a los servicios de Railway.",
    });
  }
});

// --- 4. INTEGRACIÓN DE RUTAS ---

pedidosRoutes(app);
usuarioRoutes(app);

// --- 5. ENDPOINT SEGURO PARA COMENTARIOS (VALIDACIÓN Y SANITIZACIÓN) ---

app.post(
  "/api/comentarios",
  [
    // Fase 1.3: Validación de puntuación (entero) [cite: 36]
    body("puntuacion")
      .isInt()
      .withMessage("La puntuación debe ser un número entero."),
    // Fase 1.2: Sanitización de inyecciones XSS y límite de 200 caracteres [cite: 36]
    body("texto")
      .trim()
      .escape()
      .isLength({ max: 200 })
      .withMessage("El texto no puede superar los 200 caracteres."),
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
        puntuacion: puntuacion,
        fecha: new Date().toLocaleDateString(),
      },
    });
  },
);

app.get("/", (req, res) => {
  res.send(
    "¡Hola Daniela! El servidor de Leños Rellenos está activo y protegido con CORS, Helmet, Rate Limiting y API KEY.",
  );
});

export { app };
