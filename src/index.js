// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { initBaseDeDatos } from "./bd/init.js";

/**
 * Iniciar el servidor Express después de conectar a la base de datos
 */
const startServer = async () => {
  try {
    // Fase 2: Conexión a base de datos persistente (Railway/Atlas)
    await initBaseDeDatos();

    // El puerto se asigna dinámicamente por Railway o usa el 3001 por defecto [cite: 10]
    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      // Fase 4: Prevención de logs (no imprimir DATABASE_URL ni API_KEY)
      console.info(`Servidor activo en puerto: ${PORT}`);
    });
  } catch (err) {
    console.error("Fallo crítico en el inicio del servidor:", err.message);
    process.exit(1);
  }
};

startServer();
