const API_CONFIG = {
  baseURL: 'http://localhost:3001/api',
  endpoints: {
    ninos: '/ninos',
    puntos: (id) => `/ninos/${id}/puntos`
  }
};

export default API_CONFIG;
