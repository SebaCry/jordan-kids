import { useState, useEffect } from 'react';
import ninosAPI from '../api/ninos.api';

const useNinos = () => {
  const [ninos, setNinos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarNinos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ninosAPI.getAll();
      setNinos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar niños:', err);
      setError(err.message);
      setNinos([]);
    } finally {
      setLoading(false);
    }
  };

  const crearNino = async (ninoData) => {
    try {
      const nuevoNino = await ninosAPI.create(ninoData);
      setNinos([...ninos, nuevoNino]);
      return nuevoNino;
    } catch (err) {
      console.error('Error al crear niño:', err);
      setError(err.message);
      throw err;
    }
  };

  const actualizarNino = async (id, ninoData) => {
    try {
      const ninoActualizado = await ninosAPI.update(id, ninoData);
      setNinos(ninos.map(n => n.id === id ? ninoActualizado : n));
      return ninoActualizado;
    } catch (err) {
      console.error('Error al actualizar niño:', err);
      setError(err.message);
      throw err;
    }
  };

  const eliminarNino = async (id) => {
    try {
      await ninosAPI.delete(id);
      setNinos(ninos.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error al eliminar niño:', err);
      setError(err.message);
      throw err;
    }
  };

  const agregarPuntos = async (id, actividad) => {
    try {
      const ninoActualizado = await ninosAPI.addPuntos(id, actividad);
      setNinos(ninos.map(n => n.id === id ? ninoActualizado : n));
    } catch (err) {
      console.error('Error al agregar puntos:', err);
      setError(err.message);
      throw err;
    }
  };

  const restarPuntos = async (id, actividad) => {
    try {
      const ninoActualizado = await ninosAPI.removePuntos(id, actividad);
      setNinos(ninos.map(n => n.id === id ? ninoActualizado : n));
    } catch (err) {
      console.error('Error al restar puntos:', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    cargarNinos();
  }, []);

  return {
    ninos,
    loading,
    error,
    cargarNinos,
    crearNino,
    actualizarNino,
    eliminarNino,
    agregarPuntos,
    restarPuntos
  };
};

export default useNinos;
