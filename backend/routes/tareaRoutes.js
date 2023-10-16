import express from 'express'
import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
} from '../controllers/tareaController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

router.post('/', checkAuth, agregarTarea)
router.route('/:id')
    .get(obtenerTarea, checkAuth,)
    .put(actualizarTarea, checkAuth,)
    .delete(eliminarTarea, checkAuth,)
router.post('/estado/:id', checkAuth, cambiarEstado)

export default router