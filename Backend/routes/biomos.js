import express from 'express';
import { listBiomos, getBiomo } from '../controllers/biomosController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, listBiomos);   // /api/biomos
router.get('/:id', verifyToken, getBiomo);  // /api/biomos/:id

export default router;
