// routes/convocatorias.js  (ES Modules)
import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import {
  crearConvocatoria,
  listarConvocatorias
} from '../controllers/convocatoriasController.js';

const router = Router();

/*  /api/convocatorias  */
router.post('/', verifyToken, crearConvocatoria);  // crear nueva
router.get('/',  verifyToken, listarConvocatorias); // listar todas

export default router;
