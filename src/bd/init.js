import mongoose from "mongoose";

// Añadimos 'async' para poder esperar a la base de datos
export async function initBaseDeDatos() {
  const DATABASE_URL = process.env.DATABASE_URL;

  console.log("Intentando conectar a:", DATABASE_URL);

  if (!DATABASE_URL) {
    throw new Error("ERROR: DATABASE_URL es undefined. Revisa tu archivo .env");
  }

  mongoose.connection.on("error", (error) => {
    console.error("Error de conexión:", error);
  });

  mongoose.connection.on("open", () => {
    console.info("¡Conectado exitosamente!");
  });

  // Agregamos 'await' para que la función no termine hasta estar conectados
  return await mongoose.connect(DATABASE_URL);
}
