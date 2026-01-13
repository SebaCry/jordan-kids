import { useState, useEffect } from 'react';
import ninosAPI from '../api/ninos.api';

const useNino = (id) => {
  const [nino, setNino] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarNino = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ninosAPI.getById(id);
      setNino(data);
    } catch (err) {
      console.error('Error al cargar niño:', err);
      setError(err.message);
      setNino(null);
    } finally {
      setLoading(false);
    }
  };

  const actualizarNino = async (ninoData) => {
    try {
      const ninoActualizado = await ninosAPI.update(id, ninoData);
      setNino(ninoActualizado);
      return ninoActualizado;
    } catch (err) {
      console.error('Error al actualizar niño:', err);
      setError(err.message);
      throw err;
    }
  };

  const agregarPuntos = async (actividad) => {
    try {
      const ninoActualizado = await ninosAPI.addPuntos(id, actividad);
      setNino(ninoActualizado);
    } catch (err) {
      console.error('Error al agregar puntos:', err);
      setError(err.message);
      throw err;
    }
  };

  const restarPuntos = async (actividad) => {
    try {
      const ninoActualizado = await ninosAPI.removePuntos(id, actividad);
      setNino(ninoActualizado);
    } catch (err) {
      console.error('Error al restar puntos:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (id) {
      cargarNino();
    }
  }, [id]);

  return {
    nino,
    loading,
    error,
    actualizarNino,
    agregarPuntos,
    restarPuntos,
    recargar: cargarNino
  };
};

export default useNino;
