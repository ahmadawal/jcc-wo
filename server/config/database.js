const mysql = require('mysql2/promise')
const dbConfig = {
  host: 'mysql_server', // Use the service name defined in docker-compose
  user: 'devadmin',
  password: 'devadmin',
  database: 'wo_app',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Database connected successfully')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

module.exports = { pool, testConnection }
