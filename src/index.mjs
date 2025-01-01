import helmet from 'helmet'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import 'dotenv/config'

import hraciRouter from "./routes/hraci.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(helmet())
app.use(hraciRouter)

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "index.html"))
})

app.get("/tracker", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "tracker.html"))
})

app.get("/mtracker", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "mtracker.html"))
})

app.listen(PORT, () => console.log(`Running on port: ${PORT}`))