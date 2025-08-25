import mysql from "mysql2/promise"

export const pool = mysql.createPool({
    host: "localhost",
    database: "synaptic",
    port: "3306",
    user: "root",
    password: "root",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
})

async function testConnection() {
    try {
        const connection = await pool.getConnection()
        console.log("Conexion correcta")
        connection.release();
    }
    catch (error) {
        console.error("ELWESO", error.message);
    }
}

testConnection()