import "dotenv/config"; // Asegura que cargue el .env
import { initBaseDeDatos } from "./bd/init.js";
import { Pedido } from "./bd/modelos/pedido.js";

try {
  await initBaseDeDatos();

  /**
   * Ejemplo de creación, actualización y consulta de pedidos
   */
  const pedido = new Pedido({
    nombre: "Juan Gabriel Lopez",
    telefono: "4181231234",
    direccion: "Calle Tamaulipas, Colonia Centro",
    fecha_solicitud: "2026-02-07",
    fecha_envio: "2026-02-09",
    total: 45.0,
    pagado: ["PAGADO"],
    abono: 45.0,
    comentario: "Ha sido pagado el pedido",
  });

  // 1. Guardar el nuevo pedido (solo una vez)
  const createdPedido = await pedido.save();
  console.log(" Pedido creado con éxito");

  // 2. Actualizar el nombre del cliente
  await Pedido.findByIdAndUpdate(createdPedido._id, {
    $set: { nombre: "Juan Gabriel Lopez Beltran" },
  });
  console.log("Pedido actualizado");

  // 3. Consultar y mostrar todos los pedidos
  const pedidos = await Pedido.find();

  console.log("--- LISTA DE PEDIDOS EN BD ---");
  console.log(pedidos);
} catch (error) {
  console.error(" Error en la ejecución:", error.message);
} finally {
  // Es buena práctica cerrar el proceso al terminar scripts de prueba
  process.exit();
}
