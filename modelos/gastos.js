import path from 'path'
import fs from "fs/promises"
import nodemailer from 'nodemailer'


const gastosFile = path.join(import.meta.dirname, "../data/gastos.json")
const roommatesFile = path.join(import.meta.dirname, "../data/roommates.json")

const obtenerGastos = async () => {
    try {
        const data = await fs.readFile(gastosFile, "utf-8")
        const gastos = JSON.parse(data)
        return gastos
    } catch (error) {
        console.log(error)
        return error
    }
}

const crearGastos = async (payload) => {

    const data = await fs.readFile(gastosFile, "utf-8")

    const nuevoGasto = JSON.parse(data)
    nuevoGasto.gastos.push(payload)
    fs.writeFile(gastosFile, JSON.stringify(nuevoGasto))
        .then(() => {
            console.log("Gasto creado con exito")
        })
        .catch(err => {
            console.error(`Ha ocurrido un error: ${err}`)
        })

    return nuevoGasto
}

const editarGastos = async (payload) => {
    try {
        const data = await fs.readFile(gastosFile, "utf-8")
        const gastosJSON = JSON.parse(data)
        let { gastos } = gastosJSON

        const { id } = payload
        gastos = gastos.map(gasto => {
            if (gasto.id == id) {
                gasto = payload
                return gasto
            } else {
                return gasto
            }
        })
        await fs.writeFile(gastosFile, JSON.stringify({ gastos }))
        return gastos
    } catch (error) {
        console.error(error)
        return error
    }
}

const borrarGastos = async (id) => {
    try {
        const data = await fs.readFile(gastosFile, "utf-8")
        const gastosJSON = JSON.parse(data)

        let { gastos } = gastosJSON

        gastos = gastos.filter(gasto => !(gasto.id === id))

        await fs.writeFile(gastosFile, JSON.stringify({ gastos }))
        return gastos
    } catch (error) {
        console.error(error)
        return error
    }
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
})
const enviarEmail = async () => {

    const obtenerEmail = await fs.readFile(roommatesFile, "utf-8")
    const { roommates } = JSON.parse(obtenerEmail)
    for (const roommate of roommates) {
        const { email } = roommate
        console.log(`Enviando email a: ${email}`)
        const mailOptions = {
            from: 'Nuevo gasto roommates <anders3x@gmail.com>',
            to: email,
            subject: 'Se ha registrado un nuevo gasto',
            text: 'Se ha agregado un nuevo gasto mensual a la lista de gastos Roommates'
        }
        await transporter.sendMail(mailOptions)
    }
}

export { obtenerGastos, crearGastos, editarGastos, borrarGastos, enviarEmail }