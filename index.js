const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const { allowHeaders } = require('./app/middleware')

const app = express()
const PORT = process.env.PORT || 3000

// Global middlewares
app.use(express.json())
app.use(cors())
app.use(allowHeaders)

// Routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`)
})
