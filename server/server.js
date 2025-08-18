const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv').config
const { testConnection } = require('./config/database')
const apiRoutes = require('./routes/api')
const reportRoutes = require('./routes/report')
const repairRoutes = require('./routes/repair')
const machineRoutes = require('./routes/machine')
const electricalRoutes = require('./routes/electrical')
const utilityRoutes = require('./routes/utility')
const mechanicalRoutes = require('./routes/mechanical')
const calibrationRoutes = require('./routes/calibration')

const app = express()
const PORT = 5000

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // allow 2000 requests per 15 minutes per IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
})
app.use('/api/', limiter)

// CORS configuration - Allow LAN access
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://wo-mt:5000',
      'http://wo-mt.jembo.com:5000',
      /^http:\/\/192\.168\.\d+\.\d+:5000$/, // Allow any 192.168.x.x IP
      /^http:\/\/10\.\d+\.\d+\.\d+:3000$/, // Allow any 10.x.x.x IP
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:5000$/, // Allow 172.16-31.x.x IPs
    ],
    credentials: true,
  })
)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'WO App API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
    },
  })
})

// API routes
app.use('/api', apiRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/repairs', repairRoutes)
app.use('/api/machines', machineRoutes)
app.use('/api/electrical', electricalRoutes)
app.use('/api/utility', utilityRoutes)
app.use('/api/mechanical', mechanicalRoutes)
app.use('/api/calibration', calibrationRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Something went wrong',
  })
})

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection()

    if (!dbConnected) {
      console.log(
        '⚠️  Warning: Database connection failed. Some features may not work.'
      )
      console.log('💡 Run "npm run setup:db" to set up the database.')
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Server is running!')
      console.log(`📍 Local: http://localhost:${PORT}`)
      console.log(`🌐 Network: http://wo-mt.jembo.com:${PORT}`)
      console.log(`🔗 API Base: http://wo-mt.jembo.com:${PORT}/api`)
      console.log(`📊 Health Check: http://wo-mt.jembo.com:${PORT}/api/health`)
      console.log(`⏰ Started at: ${new Date().toISOString()}`)
      console.log(
        "💡 To access from other devices, use your computer's IP address"
      )
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Start the server
startServer()
