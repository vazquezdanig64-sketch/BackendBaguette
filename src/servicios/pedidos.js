import { Pedido } from "../bd/modelos/pedido.js";

/**
 * Crea un nuevo pedido.
 */
export async function creaPedido({
  nombre,
  telefono,
  direccion, // <-- Agregado
  fecha_solicitud,
  fecha_envio,
  total,
  pagado,
  abono,
  comentario,
}) {
  const pedido = new Pedido({
    nombre,
    telefono,
    direccion, // <-- Agregado
    fecha_solicitud,
    fecha_envio,
    total,
    pagado,
    abono,
    comentario,
  });
  return await pedido.save();
}

/**
 * Obtiene una lista de pedidos con filtros y ordenamiento.
 */
export async function listaPedidos(
  query = {},
  { sortBy = "createdAt", sortOrder = "descending" } = {},
) {
  return await Pedido.find(query).sort({ [sortBy]: sortOrder });
}

/**
 * Obtiene todos los pedidos.
 */
export async function listaAllPedidos(opciones) {
  return await listaPedidos({}, opciones);
}

/**
 * Filtra pedidos por nombre (Case-insensitive).
 */
export async function listaPedidosByNombre(nombre, opciones) {
  return await listaPedidos(
    { nombre: { $regex: nombre, $options: "i" } },
    opciones,
  );
}

/**
 * Filtra pedidos por estado de pago.
 */
export async function listPedidosByPagado(pagado, opciones) {
  return await listaPedidos({ pagado }, opciones);
}

/**
 * Obtiene un pedido por su ID.
 */
export async function getPedidoById(pedidoId) {
  return await Pedido.findById(pedidoId);
}

/**
 * Modifica un pedido existente.
 */
export async function modificaPedido(
  pedidoId,
  {
    nombre,
    telefono,
    direccion, // <-- Agregado
    fecha_solicitud,
    fecha_envio,
    total,
    pagado,
    abono,
    comentario,
  },
) {
  return await Pedido.findOneAndUpdate(
    { _id: pedidoId },
    {
      $set: {
        nombre,
        telefono,
        direccion, // <-- Agregado
        fecha_solicitud,
        fecha_envio,
        total,
        pagado,
        abono,
        comentario,
      },
    },
    { new: true }, // Retorna el documento actualizado
  );
}

/**
 * Elimina un pedido por ID.
 */
export async function eliminaPedido(pedidoId) {
  return await Pedido.deleteOne({ _id: pedidoId });
}
