import express from "express"
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

import { router as roommates } from "./routes/roommates.js";
import { router as gastos } from "./routes/gastos.js";

app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.listen(3000, (req, res) => {
    console.log("Servidor en puerto 3000")
})

app.use("/roommates", roommates)
app.use("/roommate", roommates)
app.use("/gastos", gastos)
app.use("/gasto", gastos)
