const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

// Common middlewares
app.use(express.json())
app.use(cors())
app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )
  next()
})

// Routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`)
})
