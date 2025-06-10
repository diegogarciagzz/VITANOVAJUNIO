/* ------------------------------------------------------------------
   Rutas protegidas - Solo SUPER-ADMIN
-------------------------------------------------------------------*/
import express      from 'express';
import db from '../db.js'; // ✅ importación por defecto
import verifyToken  from '../middlewares/verifyToken.js';
import isSuperAdmin from '../middlewares/isSuperAdmin.js';

const r = express.Router();

/* 🔒 JWT válido + rol superadmin */
r.use(verifyToken, isSuperAdmin);

/* ────────────────────────────────────────────────────────────── */
/* GET  /api/super/users
      ?page=1&limit=50&search=juan&role=admin&order=id_usuario&dir=asc
---------------------------------------------------------------- */
r.get('/users', async (req, res) => {
  const page   = Math.max(1,  Number(req.query.page)   || 1);
  const limit  = Math.min(100,Number(req.query.limit)  || 50); // tope 100
  const search = (req.query.search || '').trim();
  const role   = (req.query.role   || '').trim();
  const order  = (req.query.order  || 'id_usuario').trim();
  const dir    = (req.query.dir    || 'ASC').toUpperCase() === 'DESC'
                 ? 'DESC' : 'ASC';

  /* Columnas permitidas para ORDER BY */
  const colsOK = { id_usuario:1, nombre:1, email:1, rol:1 };
  if (!colsOK[order])
    return res.status(400).json({ error: 'Parámetro "order" no válido' });

  const where = [];
  const args  = [];

  if (search) {
    where.push('(nombre LIKE ? OR email LIKE ?)');
    args.push(`%${search}%`, `%${search}%`);
  }
  if (role) {
    where.push('rol = ?');
    args.push(role);
  }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

  /* ① total filas para paginación */
  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) AS total
       FROM usuarios
       ${whereSQL}`, args
  );

  /* ② datos de la página solicitada */
  const offsetInt = (page - 1) * limit;      // ← números seguros
  const [rows] = await db.execute(
    `SELECT id_usuario, nombre, email, rol
       FROM usuarios
       ${whereSQL}
       ORDER BY ${order} ${dir}
       LIMIT ${limit} OFFSET ${offsetInt}`,   // ← sin placeholders
    args                                      // ← solo filtros
  );

  res.json({ total, rows });
});

/* PATCH /users/:id/role  → cambia rol */
r.patch('/users/:id/role', async (req, res) => {
  const { rol } = req.body;
  await db.execute(
    'UPDATE usuarios SET rol = ? WHERE id_usuario = ?',
    [rol, req.params.id]
  );
  res.json({ message: 'Rol actualizado' });
});

/* DELETE /users/:id  → elimina usuario */
r.delete('/users/:id', async (req, res) => {
  await db.execute(
    'DELETE FROM usuarios WHERE id_usuario = ?',
    [req.params.id]
  );
  res.json({ message: 'Usuario eliminado' });
});

/* ────────────  PENDIENTES  ──────────── */

/* GET /api/super/pending  → lista usuarios sin aprobar */
r.get('/pending', async (_, res) => {
  const [rows] = await db.execute(
    'SELECT id_usuario, nombre, email FROM usuarios WHERE aprobado = 0'
  );
  res.json(rows);
});

/* PATCH /pending/:id/approve  → aprueba usuario */
r.patch('/pending/:id/approve', async (req, res) => {
  await db.execute(
    'UPDATE usuarios SET aprobado = 1 WHERE id_usuario = ?',
    [req.params.id]
  );
  res.json({ message: 'Usuario aprobado' });
});

export default r;
