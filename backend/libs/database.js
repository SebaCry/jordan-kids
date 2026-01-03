const { eq, sql, desc } = require('drizzle-orm');
const { db } = require('./db.config');
const { ninos, puntos } = require('../schemas/db.schema');

const database = {
  // Obtener todos los niños con sus puntos
  async getAllNinos() {
    const result = await db
      .select()
      .from(ninos)
      .leftJoin(puntos, eq(ninos.id, puntos.ninoId))
      .orderBy(desc(ninos.id));

    return result.map(row => this.formatNino(row));
  },

  // Obtener niño por ID
  async getNinoById(id) {
    const result = await db
      .select()
      .from(ninos)
      .leftJoin(puntos, eq(ninos.id, puntos.ninoId))
      .where(eq(ninos.id, parseInt(id)))
      .limit(1);

    if (result.length === 0) return null;
    return this.formatNino(result[0]);
  },

  // Crear niño
  async createNino(ninoData) {
    const [nino] = await db.insert(ninos).values({
      nombre: ninoData.nombre,
      apellido: ninoData.apellido,
      edad: ninoData.edad
    }).returning();

    await db.insert(puntos).values({
      ninoId: nino.id
    });

    return await this.getNinoById(nino.id);
  },

  // Actualizar niño
  async updateNino(id, ninoData) {
    const result = await db.update(ninos)
      .set({
        nombre: ninoData.nombre,
        apellido: ninoData.apellido,
        edad: ninoData.edad
      })
      .where(eq(ninos.id, parseInt(id)))
      .returning();

    if (result.length === 0) return null;
    return await this.getNinoById(id);
  },

  // Eliminar niño
  async deleteNino(id) {
    const result = await db.delete(ninos)
      .where(eq(ninos.id, parseInt(id)))
      .returning();

    return result.length > 0;
  },

  // Agregar puntos a una actividad
  async addPuntos(id, actividad) {
    const columnMap = {
      traerBiblia: puntos.traerBiblia,
      versiculoMemorizado: puntos.versiculoMemorizado,
      participacion: puntos.participacion,
      busquedaRapida: puntos.busquedaRapida,
      traerAmigo: puntos.traerAmigo,
      responderPreguntas: puntos.responderPreguntas,
      asistenciaPuntual: puntos.asistenciaPuntual,
      realizarOracion: puntos.realizarOracion
    };

    const column = columnMap[actividad];

    await db.update(puntos)
      .set({
        [actividad]: sql`${column} + 1`
      })
      .where(eq(puntos.ninoId, parseInt(id)));

    await db.update(puntos)
      .set({
        total: sql`
          (${puntos.traerBiblia} * 2) +
          (${puntos.versiculoMemorizado} * 2) +
          (${puntos.participacion} * 1) +
          (${puntos.busquedaRapida} * 2) +
          (${puntos.traerAmigo} * 5) +
          (${puntos.responderPreguntas} * 1) +
          (${puntos.asistenciaPuntual} * 1) +
          (${puntos.realizarOracion} * 1)
        `
      })
      .where(eq(puntos.ninoId, parseInt(id)));

    return await this.getNinoById(id);
  },

  // Restar puntos de una actividad
  async removePuntos(id, actividad) {
    const columnMap = {
      traerBiblia: puntos.traerBiblia,
      versiculoMemorizado: puntos.versiculoMemorizado,
      participacion: puntos.participacion,
      busquedaRapida: puntos.busquedaRapida,
      traerAmigo: puntos.traerAmigo,
      responderPreguntas: puntos.responderPreguntas,
      asistenciaPuntual: puntos.asistenciaPuntual,
      realizarOracion: puntos.realizarOracion
    };

    const column = columnMap[actividad];

    await db.update(puntos)
      .set({
        [actividad]: sql`GREATEST(${column} - 1, 0)`
      })
      .where(eq(puntos.ninoId, parseInt(id)));

    await db.update(puntos)
      .set({
        total: sql`
          (${puntos.traerBiblia} * 2) +
          (${puntos.versiculoMemorizado} * 2) +
          (${puntos.participacion} * 1) +
          (${puntos.busquedaRapida} * 2) +
          (${puntos.traerAmigo} * 5) +
          (${puntos.responderPreguntas} * 1) +
          (${puntos.asistenciaPuntual} * 1) +
          (${puntos.realizarOracion} * 1)
        `
      })
      .where(eq(puntos.ninoId, parseInt(id)));

    return await this.getNinoById(id);
  },

  // Formatear niño con estructura de puntos
  formatNino(row) {
    const ninoData = row.ninos;
    const puntosData = row.puntos;

    return {
      id: ninoData.id,
      nombre: ninoData.nombre,
      apellido: ninoData.apellido,
      edad: ninoData.edad,
      puntos: {
        traerBiblia: puntosData?.traerBiblia || 0,
        versiculoMemorizado: puntosData?.versiculoMemorizado || 0,
        participacion: puntosData?.participacion || 0,
        busquedaRapida: puntosData?.busquedaRapida || 0,
        traerAmigo: puntosData?.traerAmigo || 0,
        responderPreguntas: puntosData?.responderPreguntas || 0,
        asistenciaPuntual: puntosData?.asistenciaPuntual || 0,
        realizarOracion: puntosData?.realizarOracion || 0
      },
      total: puntosData?.total || 0
    };
  }
};

module.exports = database;
