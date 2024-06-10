import { Router } from 'express'
import { crearRoommates, obtenerRoomates, calcularDeudas } from '../modelos/roommates.js'

const router = Router()

router.get("/", async (req, res) => {
    try {
        await calcularDeudas()
        const roomates = await obtenerRoomates()
        res.json(roomates)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 500,
            message: `Error interno de servidor`
        })
    }
})
router.post("/", async (req, res) => {
    try {
        const response = await crearRoommates()
        res.json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 500,
            message: `Error interno de servidor`
        })
    }
})

export { router }