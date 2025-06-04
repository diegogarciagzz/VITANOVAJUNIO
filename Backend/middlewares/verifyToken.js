// middlewares/verifyToken.js
import jwt from 'jsonwebtoken';

/**
 * Verifica el token Bearer y añade la info del usuario a req.user
 * Rechaza la petición con 401 si no es válido.
 */
export default function verifyToken(req, res, next) {
  // Esperamos header: Authorization: Bearer <token>
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    // payload que generaste en authController.login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;              // { id_usuario, rol }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
