import mysql2 from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

export const mysql = async (qry, parameters) => {
  try {
    const connection = await mysql2.createConnection({
      host: process.env.DB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
      connectionLimit: 100,
    })

    const [rows] = await connection.execute(qry, parameters)
    return rows
  } catch (err) {
    throw err
  }
}
