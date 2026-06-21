const transporter = require("../config/nodemailer");
const express = require("express");
const server = express.Router();

const Cita = require("../models/Cita");

server.get("/:fecha/:sucursal", async (req, res) => {
  try {
    const citas = await Cita.find({
      fecha: req.params.fecha,
      sucursal: req.params.sucursal,
    });
    const horariosOcupados = citas.map((cita) => cita.horario);
    res.json(horariosOcupados);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/", async (req, res) => {
  try {
    const { fecha, horario, sucursal } = req.body;
    const existe = await Cita.findOne({
      fecha,
      horario,
      sucursal,
    });
    if (existe) {
      return res.status(400).json({
        mensaje: "Ese horario ya está ocupado en esa sucursal",
      });
    }
    const cita = new Cita(req.body);
    await cita.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "maxdent.citas@gmail.com",
      subject: "Nueva cita agendada",
      html: `
    <h2>Nueva cita</h2>
    <p><b>Nombre:</b> ${req.body.nombre}</p>
    <p><b>Teléfono:</b> ${req.body.telefono}</p>
    <p><b>Sucursal:</b> ${req.body.sucursal}</p>
    <p><b>Fecha:</b> ${req.body.fecha}</p>
    <p><b>Horario:</b> ${req.body.horario}</p>
  `,
    });
    res.status(201).json({
      mensaje: "Cita creada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
});

module.exports = server;
