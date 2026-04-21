import mongoose from "mongoose";

/**
 * Inicia la conexión con la base de datos persistente.
 * Eliminamos las opciones obsoletas para evitar el crash del servidor.
 */
export async function initBaseDeDatos() {
  const DATABASE_URL = process.env.DATABASE_URL;

  // Fase 4.1: Prevención de Logs - No imprimimos la URL para proteger credenciales
  if (!DATABASE_URL) {
    throw new Error("ERROR: DATABASE_URL no detectada en el entorno.");
  }

  // Manejo de eventos de conexión
  mongoose.connection.on("error", (error) => {
    console.error("Error crítico de conexión en la nube:", error.message);
  });

  mongoose.connection.once("open", () => {
    // Fase 2: Evidencia de persistencia exitosa
    console.info(
      "¡Conexión establecida con éxito a la base de datos persistente!",
    );
  });

  try {
    // En versiones modernas de Mongoose, solo necesitas la URL.
    // Mongoose ya maneja el nuevo Driver de forma automática.
    return await mongoose.connect(DATABASE_URL);
  } catch (error) {
    console.error(
      "Fallo al conectar con el cluster de MongoDB Atlas:",
      error.message,
    );
    throw error;
  }
}
