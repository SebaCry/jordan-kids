// Schema para validación básica de niño
const ninoSchema = {
  nombre: {
    type: 'string',
    required: true
  },
  apellido: {
    type: 'string',
    required: true
  },
  edad: {
    type: 'number',
    required: true
  }
};

const puntosActividades = {
  traerBiblia: 2,
  versiculoMemorizado: 2,
  participacion: 1,
  busquedaRapida: 2,
  traerAmigo: 5,
  responderPreguntas: 1,
  asistenciaPuntual: 1,
  realizarOracion: 1
};

module.exports = {
  ninoSchema,
  puntosActividades
};
