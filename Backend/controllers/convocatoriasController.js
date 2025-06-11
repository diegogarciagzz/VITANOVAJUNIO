// controllers/convocatoriasController.js  (ES Modules)
import db from '../db.js';          // tu pool mysql2 / promise

/*  POST /api/convocatorias  ───────────────────────────────────── */
export const crearConvocatoria = async (req, res) => {
  try {
    const {
      titulo,
      descripcion = '',
      fecha_cierre          // YYYY-MM-DD
    } = req.body;

    if (!titulo || !fecha_cierre) {
      return res.status(400).json({ ok: false, msg: 'Título y fecha de cierre son obligatorios.' });
    }

    /*  Insertamos en la tabla PROYECTOS
        ▸ estado: 'abierto'
        ▸ id_usuario_owner lo tomamos del token (lo añade verifyToken → req.user.id)
    */
    const [result] = await db.query(
      `INSERT INTO proyectos
         (id_usuario_owner, titulo, descripcion, fecha_cierre, estado)
       VALUES ( ?, ?, ?, ?, 'abierto' )`,
      [req.user.id, titulo, descripcion, fecha_cierre]
    );

    res.json({ ok: true, id_proyecto: result.insertId });
  } catch (err) {
    console.error('❌ crearConvocatoria', err);
    res.status(500).json({ ok: false, msg: 'Error al crear la convocatoria' });
  }
};

/*  GET /api/convocatorias  ────────────────────────────────────── */
export const listarConvocatorias = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM proyectos ORDER BY fecha_creacion DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ listarConvocatorias', err);
    res.status(500).json({ ok: false, msg: 'Error al obtener convocatorias' });
  }
};
