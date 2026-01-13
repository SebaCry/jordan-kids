/**
 * Middleware para verificar que el usuario tenga rol de administrador
 * Debe usarse después de authMiddleware
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador.'
    });
  }

  next();
}

/**
 * Middleware para verificar que el usuario esté autenticado (cualquier rol)
 * Debe usarse después de authMiddleware
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticación requerida'
    });
  }
  next();
}

module.exports = {
  requireAdmin,
  requireAuth
};
