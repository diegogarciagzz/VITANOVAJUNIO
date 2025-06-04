import express from 'express';
import {
  allUsers, pendingUsers, setRole,
  approveUser, deleteUser
} from '../controllers/superAdminController.js';
import verifyToken from '../middlewares/verifyToken.js';
import isSuperAdmin from '../middlewares/isSuperAdmin.js';

const r = express.Router();

r.use(verifyToken, isSuperAdmin);          // 🔒 sólo super-admin

/* Usuarios */
r.get('/users',       allUsers);           // GET  /api/super/users
r.patch('/users/:id/role', setRole);       // PATCH body { rol }
r.delete('/users/:id',      deleteUser);   // DELETE

/* Pendientes */
r.get('/pending',     pendingUsers);       // GET  /api/super/pending
r.patch('/pending/:id/approve', approveUser); // PATCH
export default r;
