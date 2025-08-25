import express from "express"
import { pool } from "./connection.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())
app.get('/', async (request, response) => {
    console.log('ola mundo')
    response.send('holaaaaa')
})


app.post('/users', async (request, response) => {
    try {
        const {
            identification,
            password
        } = request.body

        if (!identification || !password) {
            return response.status(400).json({
                message: "La identificación y la contraseña son campos obligatorios."
            })
        }

        const [patients] = await pool.query('SELECT patient_id FROM patients WHERE identification = ?', [identification])

        if (patients.length === 0) {
            return response.status(204).json({
                message: "No se encontró un paciente con esa identificación."
            })
        }

        const patient_id = patients[0].patient_id

        const [existingUser] = await pool.query('SELECT user_id FROM users WHERE patient_id = ?', [patient_id])
        if (existingUser.length > 0) {
            return response.status(409).json({
                message: "Ya existe un usuario asociado a este paciente."
            })
        }

        const query = "INSERT INTO users (patient_id, password) VALUES (?, ?);"
        const values = [patient_id, password]
        const [result] = await pool.query(query, values)

        response.status(201).json({
            message: "Usuario creado exitosamente",
            user_id: result.insertId
        })

    } catch (error) {
        response.status(500).json({
            status: 'error',
            endpoint: request.originalUrl,
            method: request.method,
            message: error.message
        })
    }
})

app.delete('/users/:user_id', async (request, response) => {
    try {
        const { user_id } = request.params

        const query = 'DELETE FROM users WHERE user_id = ?;'

        const values = [user_id]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return response.json({ message: "Usuario eliminado" })
        }

    } catch (error) {
        response.status(500).json({
            status: 'error',
            endpoint: request.originalUrl,
            method: request.method,
            message: error.message
        })
    }
})

app.listen(3000, () => {
    console.log('http://localhost:3000')
})