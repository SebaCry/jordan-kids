const database = require('../libs/database');

const ninoService = {
  // Obtener todos los niños
  getAll() {
    return database.getAllNinos();
  },

  // Obtener niño por ID
  getById(id) {
    return database.getNinoById(id);
  },

  // Crear niño
  create(ninoData) {
    return database.createNino(ninoData);
  },

  // Actualizar niño
  update(id, ninoData) {
    return database.updateNino(id, ninoData);
  },

  // Eliminar niño
  delete(id) {
    return database.deleteNino(id);
  },

  // Agregar puntos
  agregarPuntos(id, actividad) {
    return database.addPuntos(id, actividad);
  },

  // Restar puntos
  restarPuntos(id, actividad) {
    return database.removePuntos(id, actividad);
  }
};

module.exports = ninoService;
