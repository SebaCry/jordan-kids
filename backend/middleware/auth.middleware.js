const { verifyAccessToken } = require('../utils/tokenUtils');

/**
 * Middleware para verificar el access token en las cookies
 * Agrega req.user con { userId, role } si el token es válido
 */
function authMiddleware(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'No access token provided',
        code: 'NO_TOKEN'
      });
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid access token',
      code: 'INVALID_TOKEN'
    });
  }
}

module.exports = { authMiddleware };
