// routes/users.js
import express from 'express';
import {
  saveLocation,
  saveProfile
} from '../controllers/usersController.js';
import upload from '../middlewares/upload.js';   //  ← Multer config
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// ubicación
router.put('/location', verifyToken, saveLocation);

// perfil completo (con posible foto)
router.put(
  '/profile',
  verifyToken,
  upload.single('foto'),   // campo <input name="foto">
  saveProfile
);

export default router;
