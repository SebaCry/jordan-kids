const { pgTable, serial, varchar, integer, timestamp } = require('drizzle-orm/pg-core');

// Tabla de niños
const ninos = pgTable('ninos', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  apellido: varchar('apellido', { length: 100 }).notNull(),
  edad: integer('edad').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Tabla de puntos
const puntos = pgTable('puntos', {
  id: serial('id').primaryKey(),
  ninoId: integer('nino_id').notNull().references(() => ninos.id, { onDelete: 'cascade' }),
  traerBiblia: integer('traer_biblia').default(0),
  versiculoMemorizado: integer('versiculo_memorizado').default(0),
  participacion: integer('participacion').default(0),
  busquedaRapida: integer('busqueda_rapida').default(0),
  traerAmigo: integer('traer_amigo').default(0),
  responderPreguntas: integer('responder_preguntas').default(0),
  asistenciaPuntual: integer('asistencia_puntual').default(0),
  realizarOracion: integer('realizar_oracion').default(0),
  total: integer('total').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Valores de puntos por actividad
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
  ninos,
  puntos,
  puntosActividades
};
