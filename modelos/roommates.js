import axios from "axios"
import path from 'path'
import fs from "fs/promises"
import { v4 as uuidv4 } from 'uuid'




const roommatesFile = path.join(import.meta.dirname, "../data/roommates.json")
const gastosFile = path.join(import.meta.dirname, "../data/gastos.json")

const crearRoommates = async () => {
    try {
        const data = await axios.get('https://randomuser.me/api')

        const usuarioRandom = data.data.results[0]
        const roommate = {
            id: uuidv4(),
            nombre: `${usuarioRandom.name.first} ${usuarioRandom.name.last}`,
            email: usuarioRandom.email,
            debe: 0,
            recibe: 0
        }
        fs.readFile("./data/roommates.json", "utf-8")
            .then(data => {
                const nuevoUsuario = JSON.parse(data)
                nuevoUsuario.roommates.push(roommate)
                fs.writeFile(roommatesFile, JSON.stringify(nuevoUsuario))
                    .then(() => {
                        console.log("Usuario creado con exito")
                    })
                    .catch(err => {
                        console.error(`Ha ocurrido un error: ${err}`)
                    })
            })
        return roommate
    } catch (error) {
        console.error(error)
        return error
    }
}


const obtenerRoomates = async () => {
    try {
        const data = await fs.readFile(roommatesFile, "utf-8")
        const roommates = JSON.parse(data)
        return roommates
    } catch (error) {
        console.log("Error", error)
        return error
    }
}

const calcularDeudas = async () => {
    const dataRoommates = await fs.readFile(roommatesFile, "utf-8")
    const dataGastos = await fs.readFile(gastosFile, "utf-8")

    let { roommates } = JSON.parse(dataRoommates)
    const { gastos } = JSON.parse(dataGastos)

    roommates = roommates.map(r => {
        r.debe = 0
        r.recibe = 0
        r.total = 0
        return r
    })
    const { length: totalRoommates } = roommates

    gastos.forEach(gasto => {
        const { monto, roommate: quienGasto } = gasto
        const montoPorPersona = monto / totalRoommates

        roommates = roommates.map(roommate => {
            const { nombre } = roommate
            if (quienGasto == nombre) {
                roommate.recibe += montoPorPersona * (totalRoommates - 1)
            } else {
                roommate.debe -= montoPorPersona
            }
            roommate.total = roommate.recibe - roommate.debe
            return roommate
        })
    })

    await fs.writeFile(roommatesFile, JSON.stringify({ roommates }))
}



export { crearRoommates, obtenerRoomates, calcularDeudas }
