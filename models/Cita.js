const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  sucursal: String,
  fecha: String,
  horario: String,
});

module.exports = mongoose.model("Cita", citaSchema);
