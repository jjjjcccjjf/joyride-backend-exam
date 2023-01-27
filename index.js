require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
