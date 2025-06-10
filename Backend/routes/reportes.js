import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getReportesByUser, getReporteById } from '../controllers/reportesController.js';

const router = express.Router();

router.get('/usuario/:id', verifyToken, getReportesByUser);
router.get('/:id', verifyToken, getReporteById);

export default router;
