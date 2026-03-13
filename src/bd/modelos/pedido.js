import mongoose, { Schema } from "mongoose";

/**
 * @typedef {Object} Pedido
 * @property {Schema.Types.ObjectId} cliente - Referencia al usuario que creó el pedido
 * @property {string} nombre - Nombre del cliente
 * @property {string} telefono - Teléfono del cliente (10 dígitos)
 * @property {string} direccion - Dirección de entrega
 * @property {Date} fecha_solicitud - Fecha de solicitud del pedido
 * @property {Date} fecha_envio - Fecha de envío del pedido
 * @property {number} total - Total del pedido (por defecto 0.0)
 * @property {string[]} pagado - Lista de métodos de pago utilizados
 * @property {string} comentario - Comentarios adicionales sobre el pedido
 */
const pedidoSchema = new Schema(
  {
    // Relación con el modelo de Usuario
    cliente: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
    },
    nombre: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    direccion: {
      type: String,
      required: true,
    },
    fecha_solicitud: {
      type: Date,
      required: true,
    },
    fecha_envio: {
      type: Date,
      required: true,
    },
    total: {
      type: Number,
      default: 0.0,
    },
    pagado: {
      type: [String],
      default: [],
    },
    comentario: {
      type: String,
    },
  },
  {
    timestamps: true, // Esto crea automáticamente 'createdAt' y 'updatedAt'
  },
);

export const Pedido = mongoose.model("pedido", pedidoSchema);
