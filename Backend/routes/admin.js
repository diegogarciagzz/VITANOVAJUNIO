// routes/admin.js
import express from 'express';
import {
  getPendingUsers,
  approveUser,
  getAllUsers,
  deleteUser
} from '../controllers/adminController.js';
import verifySuperAdmin from '../middlewares/verifySuperAdmin.js';

const router = express.Router();

// ----- Admin normal (aprobar / rechazar) -----
router.get('/pending', getPendingUsers);
router.post('/approve-user', approveUser);

// ----- Super-admin -----
router.get('/users', verifySuperAdmin, getAllUsers);
router.delete('/users/:id', verifySuperAdmin, deleteUser);

export default router;
