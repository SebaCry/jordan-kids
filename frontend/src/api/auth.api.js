import API_CONFIG from '../config/api.config';

const AUTH_BASE_URL = `${API_CONFIG.baseURL}/auth`;

/**
 * Maneja la respuesta de la API
 * @param {Response} response - Respuesta del fetch
 * @returns {Promise<object>} Datos de la respuesta
 * @throws {Error} Si la respuesta no es exitosa
 */
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  // Devolver solo el usuario si existe, o los datos completos
  return data.user || data;
}

/**
 * Login de usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>} Datos del usuario
 */
export async function login(email, password) {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // CRÍTICO: enviar y recibir cookies
    body: JSON.stringify({ email, password })
  });

  return handleResponse(response);
}

/**
 * Registrar nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} nombre - Nombre del usuario
 * @returns {Promise<object>} Datos del usuario
 */
export async function register(email, password, nombre) {
  const response = await fetch(`${AUTH_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, nombre })
  });

  return handleResponse(response);
}

/**
 * Cerrar sesión
 * @returns {Promise<object>} Respuesta del servidor
 */
export async function logout() {
  const response = await fetch(`${AUTH_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  return handleResponse(response);
}

/**
 * Obtener usuario actual
 * @returns {Promise<object>} Datos del usuario
 */
export async function getCurrentUser() {
  const response = await fetch(`${AUTH_BASE_URL}/me`, {
    credentials: 'include'
  });

  return handleResponse(response);
}

/**
 * Refrescar access token
 * @returns {Promise<object>} Datos del usuario actualizados
 */
export async function refreshToken() {
  const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
    method: 'POST',
    credentials: 'include'
  });

  return handleResponse(response);
}
