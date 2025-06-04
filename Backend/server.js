/* ------------------------------------------------------------------
   Backend/server.js   (ES Modules)
-------------------------------------------------------------------*/
import express           from 'express';
import cors              from 'cors';
import dotenv            from 'dotenv';
import path              from 'path';
import { fileURLToPath } from 'url';

import faunaRoutes  from './routes/fauna.js';
import authRoutes   from './routes/auth.js';
import adminRoutes  from './routes/admin.js';
import usersRoutes  from './routes/users.js';
import superRoutes  from './routes/superAdmin.js';
import biomosRoutes from './routes/biomos.js';

dotenv.config();
const app  = express();
const PORT = process.env.PORT || 3000;

/* ───────── helpers ESM ───────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ───────── paths estáticos ─────────
   FrontEnd se encuentra un nivel ARRIBA de /Backend
   Backend/
     ├─ routes/
     └─ server.js
   FrontEnd/
     ├─ index.html
     └─ ...
*/
const FRONT_PATH = path.join(__dirname, '..', 'FrontEnd');

app.use(express.static(FRONT_PATH));                         // html, css, js
app.use('/uploads', express.static(path.join(__dirname, 'utils', 'uploads')));

/* ───────── middleware global ───────── */
app.use(cors());
app.use(express.json());

/* ───────── API ───────── */
app.use('/api/auth',  authRoutes);
app.use('/api/fauna', faunaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/biomos', biomosRoutes);
app.use('/api/super', superRoutes);

/* ───────── páginas de recuperar contraseña ───────── */
app.get('/recuperarContraseña/cambiar-contraseña.html', (_, res) =>
  res.sendFile(path.join(FRONT_PATH, 'RecuperarContraseña', 'cambiar-contraseña.html'))
);
app.get('/recuperarContraseña/confirmacion-contraseña.html', (_, res) =>
  res.sendFile(path.join(FRONT_PATH, 'RecuperarContraseña', 'confirmacion-contraseña.html'))
);
app.get('/recuperarContraseña/correo-enviado.html', (_, res) =>
  res.sendFile(path.join(FRONT_PATH, 'RecuperarContraseña', 'correo-enviado.html'))
);

/* ───────── ping de salud opcional ───────── */
app.get('/api', (_, res) =>
  res.json({ message: 'API de Vitanova funcionando correctamente' })
);

/* ───────── raíz → index.html ───────── */
app.get('/', (_, res) =>
  res.sendFile(path.join(FRONT_PATH, 'index.html'))
);

/* ───────── fallback SPA → index.html ─────────
   Cualquier ruta que NO empiece con /api/ sirve al front
*/
app.get('/*', (_, res) =>
  res.sendFile(path.join(FRONT_PATH, 'index.html'))
);

/* ───────── start ───────── */
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
