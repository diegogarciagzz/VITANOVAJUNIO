// Backend/controllers/usersController.js
import { db } from '../db.js';
import path from 'path';
import fs   from 'fs';

/* util: arma SET dinámico para solo campos enviados */
function buildUpdate(fields) {
  const keys   = Object.keys(fields).filter(k => fields[k] !== undefined);
  const setStr = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  return { setStr, values };
}

/* =============== 1. GUARDAR UBICACIÓN =============== */
export const saveLocation = async (req, res) => {
  const { pais, telefono, region, ciudad, codigo_postal } = req.body;
  const id = req.user.id_usuario;        // ← viene del middleware verifyToken

  try {
    const { setStr, values } = buildUpdate({
      pais, telefono, region, ciudad, codigo_postal
    });
    if (!setStr) return res.status(400).json({ error: 'Sin datos que actualizar' });

    const [result] = await db.execute(
      `UPDATE usuarios SET ${setStr} WHERE id_usuario = ?`,
      [...values, id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Ubicación guardada con éxito' });
  } catch (err) {
    console.error('saveLocation →', err.sqlMessage || err);
    res.status(500).json({ error: 'Error al guardar la ubicación' });
  }
};

/* =============== 2. GUARDAR PERFIL COMPLETO =============== */
export const saveProfile = async (req, res) => {
  const {
    organizacion,
    descripcion_organizacion,
    pais,
    region,
    ciudad,
    telefono,
    codigo_postal           // opcional si lo mandas de nuevo
  } = req.body;

  const id = req.user.id_usuario;
  try {
    /* ----- maneja foto nueva (si se adjuntó) ----- */
    let foto_perfil;
    if (req.file) {
      foto_perfil = `/uploads/${req.file.filename}`;

      // borra la foto vieja (opcional)
      const [[{ foto_perfil: old }]] = await db.execute(
        'SELECT foto_perfil FROM usuarios WHERE id_usuario = ?',
        [id]
      );
      if (old) {
        const oldPath = path.resolve('.' + old);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    /* ----- arma el UPDATE dinámico ----- */
    const { setStr, values } = buildUpdate({
      organizacion,
      descripcion_organizacion,
      pais,
      region,
      ciudad,
      telefono,
      codigo_postal,
      foto_perfil
    });
    if (!setStr) return res.status(400).json({ error: 'Sin datos que actualizar' });

    await db.execute(
      `UPDATE usuarios SET ${setStr} WHERE id_usuario = ?`,
      [...values, id]
    );

    res.json({ message: 'Perfil actualizado', foto_perfil });
  } catch (err) {
    console.error('saveProfile →', err.sqlMessage || err);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};
