const bcrypt = require('bcryptjs');
const database = require('../libs/database');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/tokenUtils');

const authService = {
  /**
   * Registrar un nuevo usuario
   */
  async register(email, password, nombre) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await database.getUserByEmail(email);
      if (existingUser) {
        throw new Error('El correo ya está registrado');
      }

      // Hashear password con bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      // Crear usuario en DB
      const newUser = await database.createUser({
        email,
        password: hashedPassword,
        nombre,
        role: 'guest' // Por defecto guest
      });

      // Generar tokens
      const accessToken = generateAccessToken(newUser.id, newUser.role);
      const refreshToken = generateRefreshToken(newUser.id, newUser.role);

      // Guardar refresh token en DB
      await database.updateUserRefreshToken(newUser.id, refreshToken);

      return { user: newUser, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login de usuario
   */
  async login(email, password) {
    try {
      // Buscar usuario por email
      const user = await database.getUserByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar password con bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
      }

      // Generar tokens
      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);

      // Guardar refresh token en DB
      await database.updateUserRefreshToken(user.id, refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refrescar access token usando refresh token
   */
  async refreshToken(oldRefreshToken) {
    try {
      // Verificar que el refresh token sea válido
      const decoded = verifyRefreshToken(oldRefreshToken);

      // Obtener usuario de la DB
      const user = await database.getUserById(decoded.userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que el refresh token coincida con el de la DB
      if (user.refreshToken !== oldRefreshToken) {
        throw new Error('Refresh token inválido');
      }

      // Generar NUEVO access token (refresh token se mantiene igual)
      const newAccessToken = generateAccessToken(user.id, user.role);

      return { accessToken: newAccessToken, user };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout - Invalidar refresh token
   */
  async logout(userId) {
    try {
      await database.updateUserRefreshToken(userId, null);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener información del usuario actual
   */
  async getCurrentUser(userId) {
    try {
      const user = await database.getUserById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // No devolver password ni refresh token
      const { password, refreshToken, ...userWithoutSensitiveData } = user;
      return userWithoutSensitiveData;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = authService;
