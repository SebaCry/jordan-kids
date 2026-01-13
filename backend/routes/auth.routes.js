const express = require('express');
const authService = require('../services/auth.service');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Validación básica
    if (!email || !password || !nombre) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos (email, password, nombre)'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar longitud de password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const { user, accessToken, refreshToken } = await authService.register(email, password, nombre);

    // Configurar cookies HTTP-only
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutos
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    // No devolver password ni refresh token
    const { password: _, refreshToken: __, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userResponse
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const { user, accessToken, refreshToken } = await authService.login(email, password);

    // Configurar cookies HTTP-only
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // No devolver password ni refresh token
    const { password: _, refreshToken: __, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userResponse
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refrescar access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    const { accessToken, user } = await authService.refreshToken(oldRefreshToken);

    // Actualizar cookie de access token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    // No devolver password ni refresh token
    const { password, refreshToken, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Token refrescado exitosamente',
      user: userResponse
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await authService.logout(req.user.userId);

    // Limpiar cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/auth/me
 * Obtener información del usuario actual
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
