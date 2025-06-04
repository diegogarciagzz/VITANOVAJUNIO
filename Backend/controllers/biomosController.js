import { db } from '../db.js';

/* GET /api/biomos → lista */
export const listBiomos = async (_, res) => {
  try {
    /* Ajusta columnas según tu tabla */
    const [rows] = await db.execute(
      `SELECT id_biomo, nombre, fecha_creacion, estado
       FROM biomos
       ORDER BY fecha_creacion DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('listBiomos →', err.sqlMessage || err);
    res.status(500).json({ error: 'Error al obtener biomos' });
  }
};

/* GET /api/biomos/:id → detalle (opcional) */
export const getBiomo = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM biomos WHERE id_biomo = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getBiomo →', err.sqlMessage || err);
    res.status(500).json({ error: 'Error al obtener biomo' });
  }
};
