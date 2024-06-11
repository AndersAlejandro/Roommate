import { Router } from "express";
import { obtenerGastos, crearGastos, editarGastos, borrarGastos } from "../modelos/gastos.js";
import { v4 as uuidv4 } from 'uuid'

const router = Router()

router.get("/", async (req, res) => {
    try {
        const data = await obtenerGastos()
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 500,
            message: `Error interno de servidor`
        })
    }
})

router.post("/", async (req, res) => {
    const { roommate, monto, descripcion } = req.body

    if (!roommate || !monto || !descripcion) {
        res.status(400).json({
            statud: 400,
            message: 'Faltan elementos del payload'
        })
    } else {
        const gasto = {
            roommate,
            monto,
            descripcion,
            fecha: new Date(),
            id: uuidv4()
        }
        try {
            await crearGastos(gasto)
            // await enviarEmail()
            res.status(201).json({
                message: 'Gasto Creado con éxito',
                status: 201
            })
        } catch (error) {
            res.status(500).json({
                message: "Error interno de servidor",
                status: 500
            })
        }
    }
})

router.put("/", async (req, res) => {

    const { id } = req.query
    const payload = req.body

    const traeValores = !Object.values(payload).some(value => value == '')
    if (traeValores) {
        try {
            payload.id = id

            await editarGastos(payload)
            res.status(200).json({
                message: 'Gasto editado con exito'
            })
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Error interno de servidor'
            })
        }
    }
})

router.delete("/", async (req, res) => {
    const { id } = req.query

    if (!id) {
        res.status(400).json({
            message: "Falta el ID",
            status: 400
        })
    } else {
        try {
            const response = await borrarGastos(id)
            res.status(200).json({
                message: 'Gasto borrado con éxito',
                status: 200
            })
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: 'Error interno de servidor'
            })
        }
    }
})
export { router }