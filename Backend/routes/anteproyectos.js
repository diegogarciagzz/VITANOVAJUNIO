// routes/anteproyectos.js
import express from 'express';
import auth from '../middlewares/auth1.js';
import db from '../db.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proyectos');
    res.json(rows);
  } catch (err) {
    console.error('[Error GET /api/anteproyectos]:', err);
    res.status(500).json({ ok: false, msg: 'Error al obtener proyectos' });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM proyectos WHERE id_proyecto = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[Error GET /anteproyectos/:id]', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
