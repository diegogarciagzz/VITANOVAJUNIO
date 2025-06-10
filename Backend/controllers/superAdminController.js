import db from '../db.js'; // ✅ importación por defecto

/* Todos los usuarios */
export const allUsers = async (_, res) => {
  const [rows] = await db.execute(
    `SELECT id_usuario, nombre, email, rol, aprobado
       FROM usuarios ORDER BY id_usuario DESC`);
  res.json(rows);
};

/* Usuarios pendientes */
export const pendingUsers = async (_, res) => {
  const [rows] = await db.execute(
    `SELECT id_usuario, nombre, email
       FROM usuarios WHERE aprobado = 0`);
  res.json(rows);
};

/* Cambiar rol */
export const setRole = async (req, res) => {
  const { rol } = req.body;
  await db.execute('UPDATE usuarios SET rol = ? WHERE id_usuario = ?', [rol, req.params.id]);
  res.json({ message: 'Rol actualizado' });
};

/* Aprobar */
export const approveUser = async (req, res) => {
  await db.execute('UPDATE usuarios SET aprobado = 1 WHERE id_usuario = ?', [req.params.id]);
  res.json({ message: 'Usuario aprobado' });
};

/* Eliminar */
export const deleteUser = async (req, res) => {
  await db.execute('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  res.json({ message: 'Usuario eliminado' });
};
