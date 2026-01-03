import API_CONFIG from '../config/api.config';

const ninosAPI = {
  // Obtener todos los niños
  getAll: async () => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.ninos}`);
    return response.json();
  },

  // Obtener niño por ID
  getById: async (id) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.ninos}/${id}`);
    return response.json();
  },

  // Crear niño
  create: async (ninoData) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.ninos}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ninoData)
    });
    return response.json();
  },

  // Actualizar niño
  update: async (id, ninoData) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.ninos}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ninoData)
    });
    return response.json();
  },

  // Eliminar niño
  delete: async (id) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.ninos}/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Agregar puntos
  addPuntos: async (id, actividad) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.puntos(id)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ actividad })
    });
    return response.json();
  },

  // Restar puntos
  removePuntos: async (id, actividad) => {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.puntos(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ actividad })
    });
    return response.json();
  }
};

export default ninosAPI;
