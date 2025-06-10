import db from '../db.js'; // ✅ importación por defecto

export const getReportesByUser = async (req, res) => {
  try {
    const idUsuario = req.params.id;
    const [rows] = await db.query(`
      SELECT id_reporte, tipo_ecosistema, record_type, fecha_reporte, imagenes
      FROM reportes
      WHERE id_usuario = ?
      ORDER BY fecha_reporte DESC
    `, [idUsuario]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes del usuario' });
  }
};

export const getReporteById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM reportes WHERE id_reporte = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Reporte no encontrado' });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el reporte' });
  }
};
